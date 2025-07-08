package com.chat.chatapp.controller;

import com.chat.chatapp.model.TypingStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TypingController {
    @MessageMapping ("/typing")
    @SendTo("/topic/typing")
    public TypingStatus typing(String username) {
        return new TypingStatus(username, true);
    }

    @MessageMapping("/stopTyping")
    @SendTo("/topic/typing")
    public TypingStatus stopTyping(String username) {
        return new TypingStatus(username, false);
    }
}
