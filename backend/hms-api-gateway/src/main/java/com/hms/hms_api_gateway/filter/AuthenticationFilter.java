package com.hms.hms_api_gateway.filter;

import com.hms.hms_api_gateway.service.JwtService;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtService jwtService;

    public AuthenticationFilter(JwtService jwtService) {
        super(Config.class);
        this.jwtService = jwtService;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            log.info("AuthenticationFilter is called " + exchange.getRequest().getURI());

            final String tokenHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            log.info(tokenHeader, "tokenHeader");

            if (tokenHeader == null || !tokenHeader.startsWith("Bearer")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                log.info("Unauthorized request");
                return exchange.getResponse().setComplete();
            }

            final String token = tokenHeader.substring(7);

            try {
                String userId = jwtService.getUserIdFromToken(token);
                log.info("userId - {}", userId);
                return chain.filter(
                        exchange.mutate().request(
                                req -> req.header("X-User-Id", userId)
                        ).build());
            } catch (JwtException ex) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                log.info("Unauthorized request in catch {}", ex.getLocalizedMessage());
                return exchange.getResponse().setComplete();
            }
        };
    }

    public static class Config {
        // Put the configuration properties for your filter here
    }

}
