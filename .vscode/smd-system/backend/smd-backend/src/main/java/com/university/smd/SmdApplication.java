package com.university.smd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmdApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmdApplication.class, args);
    }
}