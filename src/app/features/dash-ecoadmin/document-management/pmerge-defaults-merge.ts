import { MergeSchemeGETData } from '@app/restsvc/hccl.service';

const BRACKET_TOKEN = /\[=\s*([^\]]+?)\s*\]/g;
const DOLLAR_TOKEN = /\$\{\s*([^}]+?)\s*\}/g;

/**
 * Replace merge tokens in template body with sampleValue defaults from merge schemes.
 * Supports [=tagCode] and ${tagCode}. Unknown tokens are left unchanged.
 *
 * @param templateBody FTL/markdown template contents
 * @param schemes merge-schemes payload (or a subset)
 * @param schemeCodes when provided, only tags from these scheme businessCodes are used
 */
export function mergeTemplateWithDefaults(
  templateBody: string,
  schemes: MergeSchemeGETData[],
  schemeCodes?: string[] | null,
): string {
  if (!templateBody) {
    return '';
  }

  const sampleByTag = buildSampleValueMap(schemes, schemeCodes);
  if (sampleByTag.size === 0) {
    return templateBody;
  }

  const replaceToken = (match: string, rawToken: string): string => {
    const token = rawToken.trim();
    if (!token || !sampleByTag.has(token)) {
      return match;
    }
    return sampleByTag.get(token) as string;
  };

  return templateBody
    .replace(BRACKET_TOKEN, replaceToken)
    .replace(DOLLAR_TOKEN, replaceToken);
}

function buildSampleValueMap(
  schemes: MergeSchemeGETData[],
  schemeCodes?: string[] | null,
): Map<string, string> {
  const sampleByTag = new Map<string, string>();
  const selected =
    schemeCodes && schemeCodes.length > 0
      ? new Set(schemeCodes.filter((code) => !!code))
      : null;

  for (const scheme of schemes ?? []) {
    if (selected && (!scheme.businessCode || !selected.has(scheme.businessCode))) {
      continue;
    }
    for (const tag of scheme.tags ?? []) {
      if (!tag.tagCode || tag.sampleValue == null || tag.sampleValue === '') {
        continue;
      }
      // First wins when the same tagCode appears in multiple selected schemes.
      if (!sampleByTag.has(tag.tagCode)) {
        sampleByTag.set(tag.tagCode, String(tag.sampleValue));
      }
    }
  }

  return sampleByTag;
}
