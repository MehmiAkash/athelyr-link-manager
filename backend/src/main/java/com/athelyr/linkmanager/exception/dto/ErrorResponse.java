package com.athelyr.linkmanager.exception.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ErrorResponse {
    private int status;

    private String message;

    private Instant timeStamp;


}
