FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java","-jar","target/road-system-1.0.0.jar"]
