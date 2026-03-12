package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {
    @GetMapping("/hello")   //表示这是get请求的接口 （接口路径）不可重复
    public String hello(){
        return "hello world";
    }
}
