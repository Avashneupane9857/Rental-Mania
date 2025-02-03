pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub'
        EC2_SSH_CREDENTIALS = 'ec2-ssh-id'
        EC2_HOST = '54.197.20.203'
        DOCKER_IMAGE_BACKEND = 'avash9857/be-rental_mania'  
        DOCKER_IMAGE_FRONTEND = 'avash9857/fe-rental_mania'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Avashneupane9857/Rental-Mania'
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.build("$DOCKER_IMAGE_BACKEND:latest")
                    docker.build("$DOCKER_IMAGE_FRONTEND:latest")

                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        docker.image("$DOCKER_IMAGE_BACKEND:latest").push()
                        docker.image("$DOCKER_IMAGE_FRONTEND:latest").push()
                    }
                }
            }
        }
        stage('Deploy on EC2 using Docker Compose') {
            steps {
                sshagent(['EC2_SSH_CREDENTIALS']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST '
                    cd /path/to/docker-compose-directory &&
                    docker compose pull &&
                    docker compose up --build -d
                    '
                    """
                }
            }
        }
    }
}
