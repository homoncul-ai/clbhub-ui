def url = "TBD";

def appName = "hccl";

def vers = "1.0.0";
def creds = "bitbucket_creds";

def deployApp = true;
def deployClusterName =  "gbstt" ; 

// ----------- SNIP -------------------
def imageRepo = "us.gcr.io";
def imageTagRoot = "${imageRepo}/adam-devops/${appName}";

// Git Section
//def branchName = "${env.NODE_LABELS}";
def branchName = "master";

def imageName = "${appName}";
def imageVers = "NONE";
def imageVersTest = "TEST";
def imageVersStage = "STAGE";
def isSnapshotVersion = true;
def gitCommit = "";

def logicalImageTag = "";
def imageTag =  "";

def BUILD_NUMBER = "${env.BUILD_NUMBER}";
def BUILD_ID = "${env.BUILD_ID}";
 
node {
    stage("CloneRepo") {
        def scmVars = checkout scm;
	url = scmVars.GIT_URL;
	git credentialsId: creds, url: url, branch: branchName;
	sh "git checkout ${branchName}";

	sh "git checkout ${branchName}"	;
	sh "git rev-parse ${branchName} > gitCommit.val"; 
	gitCommit = readFile 'gitCommit.val';  
	gitCommit = gitCommit.trim();
	
	sh ("git config --get remote.origin.url > giturl.tmp")
	url = readFile("giturl.tmp");
	url = url.trim();
    }
    
    stage('build_publish_docker') {
	dir ( '.') {
	    imageTag =  "${imageTagRoot}:${BUILD_ID}";
	    if (isSnapshotVersion == true) {
		logicalImageTag = "${imageTagRoot}:${imageVersTest}";
	    } else {
		logicalImageTag = "${imageTagRoot}:${imageVersStage}";
	    }
    
        sh ("env");
	    def smt = readFile 'servicemanifest.json.tmpl';
	    Date now = new Date();
	    def buildTime = "" + now.format("yyyy-MM-dd") + "T" + now.format("HH:mm:ss") + "Z";
	    def sm = smt.replace("__APP_NAME__", appName)
	    	.replace("__BUILD_ID__", BUILD_ID)
	        .replace("__BUILD_TIME__", buildTime)
	        .replace("__GIT_URL__", url)
	        .replace("__GIT_BRANCH__", branchName)
	        .replace("__GIT_COMMIT__", gitCommit)
	        .replace("__VERSION__", vers)
	        .replace("__DOCKER_IMAGE__", imageTagRoot)
	        .replace("__DOCKER_TAG__", imageTag);



            def outfile = "./src/assets/servicemanifest.json"
	    writeFile file: outfile, text: sm;
	    sh "cat " + outfile;
	     
	    sh ("cp tooling/docker/* .");
	    sh ("docker build --rm  -t ${imageTag} .");
	    sh ("gcloud docker -- push ${imageTag}");
	    sh ('echo Finished  : `pwd`');

	    sh ("docker tag ${imageTag} ${logicalImageTag}");
	    sh ("gcloud docker -- push ${logicalImageTag}");
	}
    }
    stage('updateImage') {

	if (deployApp == false) {
	    sh ("echo  Not deploying ${imageTag} - ${logicalImageTag}  ");
	} else {
	// TODO : secrets
	// TODO : set canary-srevices to be a private git repo
	
	def namespace = "";
	def envName = "";
	def deployFileRoot = "";
	if (isSnapshotVersion == true) {
	    envName = "test";
	} else {
	    envName = "stage"; // The env name is used for canary releases
	}
	// Use the KC toolset to deploy 
	def clusterName = deployClusterName;
	sh "echo $PATH"
	def cmd = "~/git/ops_tools/kc/kc imagedeploy -p ${appName} --cluster ${clusterName} --env ${envName} ";
	sh (cmd);

	cmd = "~/git/ops_tools/kc/kc service -p ${appName} --cluster ${clusterName} --env ${envName}  ";
	sh (cmd);

	cmd = "~/git/ops_tools/kc/kc url -p ${appName} --cluster ${clusterName} --env ${envName}  ";
	sh (cmd);
	

	}
    }

}
