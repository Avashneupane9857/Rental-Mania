pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub'
        DOCKER_IMAGE = 'avash9857/positivus'
        EC2_SSH_CREDENTIALS = 'ec2-ssh-id'
        EC2_HOST = '54.197.20.203'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Avashneupane9857/Rental-Mania'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("$DOCKER_IMAGE:latest")
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        docker.image("$DOCKER_IMAGE:latest").push()
                    }
                }
            }
        }
        stage('Deploy on EC2') {
            steps {
                sshagent(['EC2_SSH_CREDENTIALS']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST 'docker pull $DOCKER_IMAGE:latest && docker stop myapp || true && docker rm myapp || true && docker run -d --name myapp -p 80:5173 $DOCKER_IMAGE:latest'
                    """
                }
            }
        }
    }
}