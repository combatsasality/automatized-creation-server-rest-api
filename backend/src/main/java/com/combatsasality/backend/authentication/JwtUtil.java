package com.combatsasality.backend.authentication;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Calendar;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

   private final Key key;

    public JwtUtil() {
        String secret = System.getenv("JWT_SECRET_KEY");
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY environment variable is not set!");
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }


    public String generateToken(String username) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.YEAR, 1);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(cal.getTime())
                .signWith(key)
                .compact();
    }

    public String validateTokenAndGetUsername(String token) {
        Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);

        return claims.getBody().getSubject();
    }
}
