import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export interface TracingOptions {
  enabled: boolean;
  serviceName: string;
  consoleExporter: boolean;
  otelExporter: boolean;
}

export function setupTracing(apps: INestApplication): void {
  const config = apps.get(ConfigService);
  const options = config.get<TracingOptions>('tracingOptions', { infer: true });

  if (!options.enabled) {
    return;
  }

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: options.serviceName,
      })
    ),
  });

  if (options.consoleExporter) {
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  if (options.otelExporter) {
    provider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter()));
  }

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new HttpInstrumentation(), new NestInstrumentation()],
  });

  provider.register();
}
