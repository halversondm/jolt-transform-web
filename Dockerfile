FROM eclipse-temurin:21
LABEL authors="halversondm"
RUN mkdir -p /app/logs
WORKDIR /app
ADD jolt-transform-app/target/jolt-transform-app-0.0.1-SNAPSHOT.jar /app/lib/service.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/lib/service.jar"]