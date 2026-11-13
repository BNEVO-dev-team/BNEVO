#syntax=docker/dockerfile:1

# FrankenPHP = serveur web (Caddy) + PHP + hub Mercure intégré
FROM dunglas/frankenphp:1-php8.5 AS frankenphp_base

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends file git \
	&& install-php-extensions @composer apcu intl opcache zip \
	&& rm -rf /var/lib/apt/lists/*
# Pour une base de données, ajouter l'extension voulue ci-dessus (pdo_pgsql, pdo_mysql…)

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PHP_INI_SCAN_DIR=":$PHP_INI_DIR/app.conf.d"

COPY --link frankenphp/conf.d/10-app.ini $PHP_INI_DIR/app.conf.d/
COPY --link --chmod=755 frankenphp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY --link frankenphp/Caddyfile /etc/frankenphp/Caddyfile

ENTRYPOINT ["docker-entrypoint"]

HEALTHCHECK --start-period=60s CMD ["php", "-r", "exit(false === @file_get_contents('http://localhost:2019/metrics', context: stream_context_create(['http' => ['timeout' => 5]])) ? 1 : 0);"]
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]


# --- Développement : code monté en volume, Xdebug, rechargement à chaud ---
FROM frankenphp_base AS frankenphp_dev

ENV APP_ENV=dev
ENV XDEBUG_MODE=off
ENV FRANKENPHP_WORKER_CONFIG=watch

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini" \
	&& install-php-extensions xdebug \
	&& git config --system --add safe.directory /app

COPY --link frankenphp/conf.d/20-app.dev.ini $PHP_INI_DIR/app.conf.d/

CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile", "--watch"]


# --- Production : code et dépendances copiés dans l'image ---
FROM frankenphp_base AS frankenphp_prod

ENV APP_ENV=prod

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY --link frankenphp/conf.d/20-app.prod.ini $PHP_INI_DIR/app.conf.d/

# Dépendances d'abord, pour profiter du cache Docker
COPY --link composer.* symfony.* ./
RUN composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress

COPY --link --exclude=frankenphp/ . ./

RUN mkdir -p var/cache var/log var/share \
	&& composer dump-autoload --classmap-authoritative --no-dev \
	&& composer dump-env prod \
	&& composer run-script --no-dev post-install-cmd \
	&& chmod +x bin/console \
	&& chown -R www-data:www-data var
