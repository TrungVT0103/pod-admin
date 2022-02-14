def notifyCICD(String buildStatus = 'pending', String message = "") {
    def CHANNEL_ID = -1001336786131
    def BOT_TOKEN = "1700318311:AAEH8NjK8_XVzTICZvDaOr4s3WSWETpTK_c"
    // status = [pending, running, success, failed, canceled]
    buildStatus = buildStatus ?: 'success'

    // Default values
    def msg = "${buildStatus}: Job <${env.BUILD_URL}/console|${env.JOB_NAME} [${env.BUILD_NUMBER}]>"
    switch (buildStatus) {
        case ['running']:
            msg = "${env.JOB_NAME} is starting"
            break
        case ['success']:
            msg = "${env.JOB_NAME} is success"
            break
        case ['failed']:
            msg = "${env.JOB_NAME} is failed"
            break
        default:
            msg = message
    }
    msg = "ADMIN-LATTEHUB ==> ${msg}"
    // send notification to telegram group
    // telegramSend(message: msg, chatId: -1001493598896)
    sh "curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{\"chat_id\": ${CHANNEL_ID}, \"text\": \"${msg}\"}' \
     https://api.telegram.org/bot${BOT_TOKEN}/sendMessage"
}

//Set discard job
properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '5', artifactNumToKeepStr: '3', daysToKeepStr: '5', numToKeepStr: '5']]])

def getGitCommitHash() {
    return sh(script: "git log -n 1 --pretty=format:'%h'", returnStdout: true)
}

node('master') {
    def project = 'frontend'
    def hashCommit = ''
    def workspace = pwd()
    def privateRegistry = 'registry.lattehub.com'
    // Checkout service
    stage('Checkout source code') {
        sh "sudo chown -R jenkins:jenkins ."
        sh "rm -rf ${workspace}/*"
        checkout scm
        hashCommit = getGitCommitHash()
        notifyCICD('notice', "<===== START =====>")
        notifyCICD('running')
    }
    stage('Build and push docker image') {
        def appName = 'admin-lattehub'
        def imageTag = "${project}/${appName}:${env.BRANCH_NAME}"
        imageTag = imageTag + "." + gitCommitHash
        dockerTag = "${env.BRANCH_NAME}" + "." + gitCommitHash
        dockerImage = "${privateRegistry}/${imageTag}"
        switch (env.BRANCH_NAME) {
            case ['master']:
                docker.withRegistry('https://registry.lattehub.com', '3125c611-f617-4def-b902-8e3c494d7c17') {
                    def customImage = docker.build("${imageTag}")
                    try {
                        customImage.push()
                        notifyCICD('notice', "${imageTag} SUCCESS")
                    } catch (AssertionError e) {
                        currentBuild.result = 'FAILURE'
                        notifyCICD('notice', "${imageTag} FAILURE")
                        throw e
                    } finally {
                        sh "docker rmi -f ${imageTag} ${dockerImage}"
                    }
                }
                break

            case ['production']:
                docker.withRegistry('https://registry.lattehub.com', '3125c611-f617-4def-b902-8e3c494d7c17') {
                    def customImage = docker.build("${imageTag}")
                    try {
                        customImage.push()
                        notifyCICD('notice', "${imageTag} SUCCESS")
                    } catch (AssertionError e) {
                        currentBuild.result = 'FAILURE'
                        notifyCICD('notice', "${imageTag} FAILURE")
                        throw e
                    } finally {
                        sh "docker rmi -f ${imageTag} ${dockerImage}"
                    }
                }
                break

            case ~/^v.*/:
                docker.withRegistry('https://registry.lattehub.com', '3125c611-f617-4def-b902-8e3c494d7c17') {
                    try {
                        imageTag = "${project}/${appName}:${env.BRANCH_NAME}"
                        dockerImage = "${privateRegistry}/${imageTag}"
                        def customImage = docker.build("${imageTag}")
                        customImage.push()
                        notifyCICD('notice', "${imageTag} SUCCESS")
                    } catch (AssertionError e) {
                        currentBuild.result = 'FAILURE'
                        notifyCICD('notice', "${imageTag} FAILURE")
                        throw e
                    } finally {
                        sh "docker rmi -f ${imageTag} ${dockerImage}"
                    }
                }
                break
        }
    }

    stage('Report CI') {
        try {
            if (currentBuild.result == 'FAILURE') {
                notifyCICD('failed')
            } else {
                notifyCICD('success')
            }
        } catch (err) {
            notifyCICD('failed')
            throw err
        } finally {
            notifyCICD('notice', '<===== END =====>')
        }
    }
}