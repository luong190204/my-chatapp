package com.chat.chatapp.controller;

import org.springframework.stereotype.Controller;

import com.chat.chatapp.model.*;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        System.out.println("Received message" + message);

        // Gán timeStamp hiện tại (Giờ hệ thống)
        String timeNow = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        message.setTimestamp(timeNow);

        // Gán trạng thái mặc định là "sent"
        message.setStatus("sent");
        return message;
    }

    private String getNow() {
        return LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    @MessageMapping("/leave")
    @SendTo("/topic/messages")
    public ChatMessage leave(String username) {
        ChatMessage newMessage = new ChatMessage();
        newMessage.setContent(username + " Left the chat room");
        newMessage.setSender("System");
        newMessage.setType("LEAVE");
        newMessage.setTimestamp(getNow());
        newMessage.setStatus("sent");
        return newMessage;
    }

    @MessageMapping("/join")
    @SendTo("/topic/messages")
    public ChatMessage join(String username) {
        ChatMessage newMessage = new ChatMessage();
        newMessage.setContent(username + " Joined chat room ");
        newMessage.setSender("System");
        newMessage.setType("JOIN");
        newMessage.setTimestamp(getNow());
        newMessage.setStatus("sent");
        return newMessage;
    }

}
