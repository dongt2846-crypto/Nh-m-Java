FROM fluent/fluentd:latest

# Use root account to use apk
USER root

# Install plugins
RUN buildDeps="sudo make gcc g++ libc-dev" \
 && apt-get update \
 && apt-get install -y --no-install-recommends $buildDeps \
 && sudo gem install fluent-plugin-elasticsearch \
 && sudo gem install fluent-plugin-prometheus \
 && sudo gem install fluent-plugin-record-modifier \
 && sudo gem install fluent-plugin-grok-parser \
 && sudo gem sources --clear-all \
 && SUDO_FORCE_REMOVE=yes \
    apt-get purge -y --auto-remove \
                  -o APT::AutoRemove::RecommendsImportant=false \
                  $buildDeps \
 && rm -rf /var/lib/apt/lists/* \
 && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem

# Copy configuration files
COPY fluent.conf /fluentd/etc/

# Create log directory
RUN mkdir -p /fluentd/log

# Ensure fluent user can write to log directory
RUN chown -R fluent:fluent /fluentd/log

USER fluent
