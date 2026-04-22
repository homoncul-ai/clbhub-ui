ALTER VIEW user_login_application_event_year_vw AS
SELECT system_ident AS application_name,
       o.org_entity_key AS org_id,
       o.org_entity_name AS org_name,
       YEAR(tl.date_created) AS login_year,
       COUNT(DISTINCT o.uac_user_key) AS num_users
FROM amstransaction_log tl WITH(NOLOCK),
     STORGANIZATION_VIEW o WITH(NOLOCK)
WHERE tl.USER_KEY = o.uac_user_key
  AND tl.TRANSACTION_TYPE_KEY = 501
GROUP BY system_ident,
         o.org_entity_key,
         o.org_entity_name,
         YEAR(tl.date_created);



