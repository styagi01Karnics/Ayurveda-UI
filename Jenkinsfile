
timestamps {

    node {

        properties([
            buildDiscarder(logRotator(numToKeepStr: '3')),
            disableConcurrentBuilds()
        ])

        def sonarHome = tool 'SonarScanner'

        env.APP_NAME = 'ayurvedaa-ui'
        env.IMAGE_NAME = 'sunardock/ayurvedaa-ui'
        env.DOCKER_ORG = 'sunardock'

        env.DEPLOY_SERVER = '45.195.229.15'
        env.DEPLOY_PATH = '/root/ayurvedaa-ui'
        env.APP_PORT = '8100'

        env.SONAR_HOME = sonarHome

        env.DOCKER_CONFIG = "${env.WORKSPACE}/.docker-config-${env.BUILD_NUMBER}"

        def branchName = env.BRANCH_NAME ?: 'unknown'

        try {

            // =====================================================
            // CHECKOUT SOURCE
            // =====================================================

            stage('Checkout Source') {

                checkout scm

                def branch = env.BRANCH_NAME ?: 'unknown'

                env.SAFE_BRANCH = branch
                    .replaceAll('[^a-zA-Z0-9_.-]', '-')
                    .replaceAll('-+', '-')
                    .replaceAll('^-|-$', '')
                    .toLowerCase()

                if (!env.SAFE_BRANCH) {
                    env.SAFE_BRANCH = 'unknown'
                }

                env.IMAGE_TAG = "${env.SAFE_BRANCH}-${env.BUILD_NUMBER}"

                echo "=========================================="
                echo "Ayurvedaa UI Multibranch Pipeline"
                echo "=========================================="
                echo "Branch      : ${branchName}"
                echo "Safe Branch : ${env.SAFE_BRANCH}"
                echo "Build       : ${env.BUILD_NUMBER}"
                echo "Image       : ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                echo "=========================================="
            }


            // =====================================================
            // ENVIRONMENT CHECK
            // =====================================================

            stage('Environment Check') {

                sh '''
                    set -e

                    echo "=========================================="
                    echo "Environment Check"
                    echo "=========================================="

                    node --version
                    npm --version
                    docker --version
                    git --version
                    command -v ssh
                    command -v scp

                    echo "=========================================="
                '''
            }


            // =====================================================
            // INSTALL DEPENDENCIES
            // =====================================================

            stage('Install Dependencies') {

                sh '''
                    set -e

                    echo "=========================================="
                    echo "Installing Dependencies"
                    echo "=========================================="

                    npm ci

                    echo "Dependencies installed successfully."
                '''
            }


            // =====================================================
            // BUILD REACT APPLICATION
            // =====================================================

            stage('Build React Application') {

                sh '''
                    set -e

                    echo "=========================================="
                    echo "Building Ayurvedaa UI"
                    echo "=========================================="

                    npm run build

                    echo "=========================================="
                    echo "Verifying React Build"
                    echo "=========================================="

                    test -d dist
                    test -f dist/index.html

                    echo "React build completed successfully."
                '''
            }


            // =====================================================
            // DEV BRANCH ONLY
            // =====================================================

            if (branchName == 'dev') {


                // =================================================
                // SONARQUBE ANALYSIS
                // =================================================

                stage('SonarQube Analysis') {

                    withSonarQubeEnv('SonarQube') {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "SonarQube Analysis: Ayurvedaa UI"
                            echo "=========================================="

                            "${SONAR_HOME}/bin/sonar-scanner" \
                                -Dsonar.projectKey=ayurvedaa-ui \
                                -Dsonar.projectName="Ayurvedaa UI" \
                                -Dsonar.sources=src \
                                -Dsonar.exclusions="node_modules/**,dist/**,build/**,coverage/**" \
                                -Dsonar.sourceEncoding=UTF-8

                            echo "SonarQube analysis completed."
                        '''
                    }
                }


                // =================================================
                // VERIFY DEPLOYMENT FILES
                // =================================================

                stage('Verify Deployment Files') {

                    sh '''
                        set -e

                        echo "=========================================="
                        echo "Verifying Deployment Files"
                        echo "=========================================="

                        test -f Dockerfile
                        test -f nginx.conf
                        test -f docker-compose.yml

                        echo "Dockerfile found."
                        echo "nginx.conf found."
                        echo "docker-compose.yml found."
                    '''
                }


                // =================================================
                // DOCKER LOGIN
                // =================================================

                stage('Docker Login') {

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-creds',
                            usernameVariable: 'DOCKER_USERNAME',
                            passwordVariable: 'DOCKER_PASSWORD'
                        )
                    ]) {

                        sh '''
                            set -eu

                            echo "=========================================="
                            echo "Docker Hub Login"
                            echo "=========================================="

                            mkdir -p "$DOCKER_CONFIG"
                            chmod 700 "$DOCKER_CONFIG"

                            login_docker() {
                                printf '%s' "$DOCKER_PASSWORD" |
                                    docker login \
                                        --username "$DOCKER_USERNAME" \
                                        --password-stdin
                            }

                            ATTEMPT=1
                            MAX_ATTEMPTS=3
                            WAIT_TIME=5

                            until login_docker
                            do
                                if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
                                    echo "ERROR: Docker Hub login failed after $MAX_ATTEMPTS attempts."
                                    exit 1
                                fi

                                echo "Docker login failed. Retrying in $WAIT_TIME seconds..."

                                sleep "$WAIT_TIME"

                                ATTEMPT=$((ATTEMPT + 1))
                                WAIT_TIME=$((WAIT_TIME * 2))
                            done

                            echo "Docker Hub login successful."
                        '''
                    }
                }


                // =================================================
                // DOCKER BUILD
                // =================================================

                stage('Docker Build') {

                    sh '''
                        set -eu

                        IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

                        echo "=========================================="
                        echo "Building Ayurvedaa UI Docker Image"
                        echo "=========================================="

                        echo "Image: $IMAGE"

                        ATTEMPT=1
                        MAX_ATTEMPTS=3
                        WAIT_TIME=10

                        while true
                        do
                            if docker build -t "$IMAGE" .; then
                                break
                            fi

                            if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
                                echo "ERROR: Docker build failed after $MAX_ATTEMPTS attempts."
                                exit 1
                            fi

                            echo "Docker build failed. Retrying in $WAIT_TIME seconds..."

                            sleep "$WAIT_TIME"

                            ATTEMPT=$((ATTEMPT + 1))
                            WAIT_TIME=$((WAIT_TIME * 2))
                        done

                        docker image inspect "$IMAGE" >/dev/null

                        echo "Docker image built successfully."
                    '''
                }


                // =================================================
                // DOCKER PUSH
                // =================================================

                stage('Docker Push') {

                    sh '''
                        set -eu

                        IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

                        echo "=========================================="
                        echo "Pushing Image to Docker Hub"
                        echo "=========================================="

                        echo "Image: $IMAGE"

                        ATTEMPT=1
                        MAX_ATTEMPTS=4
                        WAIT_TIME=10

                        while true
                        do
                            if docker push "$IMAGE"; then
                                break
                            fi

                            if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
                                echo "ERROR: Docker push failed after $MAX_ATTEMPTS attempts."
                                exit 1
                            fi

                            echo "Docker push failed. Retrying in $WAIT_TIME seconds..."

                            sleep "$WAIT_TIME"

                            ATTEMPT=$((ATTEMPT + 1))
                            WAIT_TIME=$((WAIT_TIME * 2))
                        done

                        echo "Image pushed successfully: $IMAGE"
                    '''
                }


                // =================================================
                // JENKINS SERVER CLEANUP
                // =================================================

                stage('Jenkins Docker Cleanup') {

                    sh '''
                        set -eu

                        CURRENT_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

                        echo "=========================================="
                        echo "Jenkins Docker Cleanup"
                        echo "=========================================="

                        echo "Keeping: $CURRENT_IMAGE"

                        docker images "$IMAGE_NAME" \
                            --format '{{.Repository}}:{{.Tag}}' |
                        while IFS= read -r IMAGE
                        do
                            [ -z "$IMAGE" ] && continue

                            if [ "$IMAGE" = "$CURRENT_IMAGE" ]; then
                                echo "KEEPING: $IMAGE"
                            else
                                echo "REMOVING: $IMAGE"
                                docker image rm "$IMAGE" || true
                            fi
                        done

                        echo ""
                        echo "Remaining Ayurvedaa UI images:"

                        docker images "$IMAGE_NAME"

                        echo "Jenkins cleanup completed."
                    '''
                }


                // =================================================
                // PREPARE APPLICATION SERVER
                // SSH PRIVATE KEY AUTHENTICATION
                // =================================================

                stage('Prepare Application Server') {

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'new-server-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USERNAME'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "Preparing Application Server"
                            echo "=========================================="

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                "mkdir -p '$DEPLOY_PATH'"

                            echo "Application directory verified."
                        '''
                    }
                }


                // =================================================
                // COPY DOCKER COMPOSE
                // SSH PRIVATE KEY AUTHENTICATION
                // =================================================

                stage('Copy Docker Compose') {

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'new-server-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USERNAME'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "Copying Docker Compose"
                            echo "=========================================="

                            scp -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                docker-compose.yml \
                                "$SSH_USERNAME@$DEPLOY_SERVER:$DEPLOY_PATH/docker-compose.yml"

                            echo "Docker Compose copied successfully."
                        '''
                    }
                }


                // =================================================
                // DEPLOYMENT SCRIPT
                // =================================================

                stage('Deploy Application') {

                    def deployScript = '''#!/bin/bash

set -euo pipefail

APP_DIR="$1"
IMAGE_NAME="$2"
IMAGE_TAG="$3"
BRANCH_NAME="$4"
BUILD_NUMBER="$5"
APP_NAME="$6"

CURRENT_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

HISTORY_FILE="${APP_DIR}/.ui-image-history"
HISTORY_TMP="${APP_DIR}/.ui-image-history.tmp"
CANDIDATE_FILE="${APP_DIR}/.ui-image-candidates.tmp"

echo "=========================================="
echo "Ayurvedaa UI Deployment"
echo "=========================================="

echo "Branch      : $BRANCH_NAME"
echo "Build       : $BUILD_NUMBER"
echo "Image       : $CURRENT_IMAGE"
echo "Server      : 45.195.229.15"
echo "Deploy Dir  : $APP_DIR"

echo "=========================================="

exec 9>/var/lock/ayurvedaa-ui-deployment.lock

if ! flock -n 9; then
    echo "ERROR: Another Ayurvedaa UI deployment is running."
    exit 1
fi

echo "Deployment lock acquired."

cd "$APP_DIR"

export IMAGE_NAME
export IMAGE_TAG

echo ""
echo "===== Validate Compose Configuration ====="

docker compose config --quiet

RUNNING_IMAGE=$(
    docker inspect "$APP_NAME" \
        --format='{{.Config.Image}}' 2>/dev/null || true
)

echo "Currently running image: ${RUNNING_IMAGE:-none}"

rm -f "$CANDIDATE_FILE"
touch "$CANDIDATE_FILE"

add_candidate() {
    local IMAGE="$1"

    [ -z "$IMAGE" ] && return 0
    [ "$IMAGE" = "$CURRENT_IMAGE" ] && return 0

    case "$IMAGE" in
        "$IMAGE_NAME":*) ;;
        *) return 0 ;;
    esac

    if ! grep -Fxq "$IMAGE" "$CANDIDATE_FILE"; then
        printf '%s\\n' "$IMAGE" >> "$CANDIDATE_FILE"
    fi
}

add_candidate "$RUNNING_IMAGE"

if [ -f "$HISTORY_FILE" ]; then
    while IFS= read -r IMAGE || [ -n "$IMAGE" ]
    do
        add_candidate "$IMAGE"
    done < "$HISTORY_FILE"
fi

echo ""
echo "===== Previous Images ====="

cat "$CANDIDATE_FILE" || true

echo ""
echo "===== Restoring Previous Images ====="

while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue

    if docker image inspect "$IMAGE" >/dev/null 2>&1; then
        echo "Already available: $IMAGE"
    else
        echo "Attempting to restore: $IMAGE"

        ATTEMPT=1
        MAX_ATTEMPTS=3
        WAIT_TIME=5

        until docker pull "$IMAGE"; do

            if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
                echo "WARNING: Previous image unavailable: $IMAGE"
                break
            fi

            echo "Previous image pull failed. Retrying in $WAIT_TIME seconds..."

            sleep "$WAIT_TIME"

            ATTEMPT=$((ATTEMPT + 1))
            WAIT_TIME=$((WAIT_TIME * 2))
        done
    fi
done < "$CANDIDATE_FILE"

echo ""
echo "===== Pulling Current UI Image ====="

ATTEMPT=1
MAX_ATTEMPTS=4
WAIT_TIME=10

until docker compose pull; do

    if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
        echo "ERROR: Current UI image pull failed."
        exit 1
    fi

    echo "Docker Compose pull failed. Retrying in $WAIT_TIME seconds..."

    sleep "$WAIT_TIME"

    ATTEMPT=$((ATTEMPT + 1))
    WAIT_TIME=$((WAIT_TIME * 2))
done

echo ""
echo "===== Starting Current UI Deployment ====="

docker compose up -d --remove-orphans

echo ""
echo "===== Verifying Deployment Image ====="

DEPLOYED_IMAGE=$(
    docker inspect "$APP_NAME" \
        --format='{{.Config.Image}}' 2>/dev/null || true
)

if [ "$DEPLOYED_IMAGE" != "$CURRENT_IMAGE" ]; then
    echo "ERROR: Deployment image mismatch."
    echo "Expected: $CURRENT_IMAGE"
    echo "Actual  : ${DEPLOYED_IMAGE:-none}"
    exit 1
fi

echo "Running image confirmed: $DEPLOYED_IMAGE"

echo ""
echo "===== Updating Image History ====="

rm -f "$HISTORY_TMP"

printf '%s\\n' "$CURRENT_IMAGE" > "$HISTORY_TMP"

while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue
    [ "$IMAGE" = "$CURRENT_IMAGE" ] && continue

    if docker image inspect "$IMAGE" >/dev/null 2>&1; then
        if ! grep -Fxq "$IMAGE" "$HISTORY_TMP"; then
            printf '%s\\n' "$IMAGE" >> "$HISTORY_TMP"
        fi
    else
        echo "Skipping unavailable image: $IMAGE"
    fi

    if [ "$(wc -l < "$HISTORY_TMP")" -ge 3 ]; then
        break
    fi
done < "$CANDIDATE_FILE"

mv "$HISTORY_TMP" "$HISTORY_FILE"
rm -f "$CANDIDATE_FILE"

echo ""
echo "===== Final Image History ====="

nl -ba "$HISTORY_FILE"

echo ""
echo "===== Container Status ====="

docker compose ps

echo ""
echo "Ayurvedaa UI deployment completed."
'''

                    writeFile(
                        file: 'deploy-ayurvedaa-ui.sh',
                        text: deployScript
                    )

                    sh 'chmod +x deploy-ayurvedaa-ui.sh'

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'new-server-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USERNAME'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "Deploying Ayurvedaa UI"
                            echo "=========================================="

                            scp -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                deploy-ayurvedaa-ui.sh \
                                "$SSH_USERNAME@$DEPLOY_SERVER:/tmp/deploy-ayurvedaa-ui.sh"

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                bash /tmp/deploy-ayurvedaa-ui.sh \
                                "$DEPLOY_PATH" \
                                "$IMAGE_NAME" \
                                "$IMAGE_TAG" \
                                "$BRANCH_NAME" \
                                "$BUILD_NUMBER" \
                                "$APP_NAME"

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                rm -f /tmp/deploy-ayurvedaa-ui.sh
                        '''
                    }

                    sh 'rm -f deploy-ayurvedaa-ui.sh'
                }


                // =================================================
                // CONTAINER VERIFICATION
                // SSH PRIVATE KEY AUTHENTICATION
                // =================================================

                stage('Container Verification') {

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'new-server-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USERNAME'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "Container Verification"
                            echo "=========================================="

                            sleep 10

                            echo ""
                            echo "===== Docker Compose Status ====="

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                "cd '$DEPLOY_PATH' && docker compose ps"

                            echo ""
                            echo "===== Verify Nginx Configuration ====="

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                "docker exec '$APP_NAME' nginx -t"

                            echo ""
                            echo "===== HTTP Verification ====="

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                "curl -f http://127.0.0.1:$APP_PORT/"

                            echo ""
                            echo "Ayurvedaa UI verification completed successfully."
                        '''
                    }
                }


                // =================================================
                // APPLICATION SERVER IMAGE CLEANUP
                // =================================================

                stage('Application Server Docker Cleanup') {

                    def cleanupScript = '''#!/bin/bash

set -euo pipefail

APP_DIR="/root/ayurvedaa-ui"
IMAGE_NAME="sunardock/ayurvedaa-ui"
APP_NAME="ayurvedaa-ui"

HISTORY_FILE="${APP_DIR}/.ui-image-history"

echo "=========================================="
echo "Ayurvedaa UI Image Cleanup"
echo "=========================================="

if [ ! -f "$HISTORY_FILE" ]; then
    echo "ERROR: Image history is missing."
    echo "No images will be removed."
    exit 1
fi

RUNNING_IMAGE=$(
    docker inspect "$APP_NAME" \
        --format='{{.Config.Image}}' 2>/dev/null || true
)

if [ -z "$RUNNING_IMAGE" ]; then
    echo "ERROR: Ayurvedaa UI container is missing."
    echo "No images will be removed."
    exit 1
fi

if ! grep -Fxq "$RUNNING_IMAGE" "$HISTORY_FILE"; then
    echo "ERROR: Running image is not in history."
    echo "No images will be removed."
    exit 1
fi

while IFS= read -r IMAGE || [ -n "$IMAGE" ]
do
    case "$IMAGE" in
        "$IMAGE_NAME":*) ;;
        *)
            echo "ERROR: Invalid image in history: $IMAGE"
            echo "No images will be removed."
            exit 1
            ;;
    esac
done < "$HISTORY_FILE"

HISTORY_COUNT=$(wc -l < "$HISTORY_FILE")

if [ "$HISTORY_COUNT" -gt 3 ]; then
    echo "ERROR: History contains more than three entries."
    echo "No images will be removed."
    exit 1
fi

echo ""
echo "===== Images To Preserve ====="

nl -ba "$HISTORY_FILE"

echo ""
echo "===== Images Before Cleanup ====="

docker images "$IMAGE_NAME"

echo ""
echo "===== Removing Old UI Images ====="

docker images "$IMAGE_NAME" \
    --format '{{.Repository}}:{{.Tag}}' |
while IFS= read -r IMAGE
do
    [ -z "$IMAGE" ] && continue

    if grep -Fxq "$IMAGE" "$HISTORY_FILE"; then
        echo "KEEPING: $IMAGE"
    else
        echo "REMOVING: $IMAGE"
        docker image rm "$IMAGE" || true
    fi
done

echo ""
echo "===== Final Ayurvedaa UI Images ====="

docker images "$IMAGE_NAME"

echo ""
echo "===== Final Image History ====="

nl -ba "$HISTORY_FILE"

echo ""
echo "Ayurvedaa UI image cleanup completed."
'''

                    writeFile(
                        file: 'cleanup-ayurvedaa-ui.sh',
                        text: cleanupScript
                    )

                    sh 'chmod +x cleanup-ayurvedaa-ui.sh'

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'new-server-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USERNAME'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "=========================================="
                            echo "Application Server Docker Cleanup"
                            echo "=========================================="

                            scp -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                cleanup-ayurvedaa-ui.sh \
                                "$SSH_USERNAME@$DEPLOY_SERVER:/tmp/cleanup-ayurvedaa-ui.sh"

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                bash /tmp/cleanup-ayurvedaa-ui.sh

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o BatchMode=yes \
                                -o StrictHostKeyChecking=yes \
                                "$SSH_USERNAME@$DEPLOY_SERVER" \
                                rm -f /tmp/cleanup-ayurvedaa-ui.sh
                        '''
                    }

                    sh 'rm -f cleanup-ayurvedaa-ui.sh'
                }


            } else {

                // ================================================
                // NON-DEV BRANCH
                // ================================================

                echo "=========================================="
                echo "NON-DEV BRANCH"
                echo "=========================================="

                echo "Branch: ${branchName}"
                echo "React build completed."
                echo "Unit testing completed."

                echo "No SonarQube analysis."
                echo "No Docker build."
                echo "No Docker push."
                echo "No deployment."
                echo "No Docker image cleanup."

                echo "Pipeline stopping after Unit Testing."

                echo "=========================================="
            }


            // =====================================================
            // PIPELINE SUCCESS
            // =====================================================

            echo "=========================================="
            echo "PIPELINE EXECUTED SUCCESSFULLY"
            echo "=========================================="

            echo "Branch      : ${branchName}"
            echo "Safe Branch : ${env.SAFE_BRANCH}"
            echo "Build       : ${env.BUILD_NUMBER}"

            if (branchName == 'dev') {
                echo "Docker Image: ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                echo "Deploy Server: ${env.DEPLOY_SERVER}"
                echo "Application Port: ${env.APP_PORT}"
            } else {
                echo "Deployment: Skipped (non-dev branch)"
            }

            echo "=========================================="


        } catch (err) {

            echo "=========================================="
            echo "PIPELINE FAILED"
            echo "=========================================="

            echo "Branch: ${branchName}"
            echo "Build : ${env.BUILD_NUMBER}"
            echo "Check Jenkins Console Output."

            echo "=========================================="

            currentBuild.result = 'FAILURE'

            throw err

        } finally {

            // Logout only from this build's isolated Docker config.
            if (branchName == 'dev') {

                sh '''
                    set +e

                    if [ -n "$DOCKER_CONFIG" ] && [ -d "$DOCKER_CONFIG" ]; then
                        docker logout
                        rm -rf "$DOCKER_CONFIG"
                    fi

                    exit 0
                '''
            }

            echo "Cleaning Jenkins workspace..."

            cleanWs()
        }
    }
}
