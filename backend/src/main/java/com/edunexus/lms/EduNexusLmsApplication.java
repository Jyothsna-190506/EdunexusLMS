package com.edunexus.lms;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.io.File;

@SpringBootApplication
@EnableMongoAuditing
public class EduNexusLmsApplication {

    public static void main(String[] args) {
        // Load .env file if present
        try {
            File envFile = new File(".env");
            if (envFile.exists()) {
                Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
                dotenv.entries().forEach(entry -> {
                    if (System.getProperty(entry.getKey()) == null) {
                        System.setProperty(entry.getKey(), entry.getValue());
                    }
                });
            }
        } catch (Exception e) {
            System.out.println("Note: .env file loading skipped or handled by environment: " + e.getMessage());
        }

        SpringApplication.run(EduNexusLmsApplication.class, args);
    }
}
