# VRS Replace - Metrics

Data logging could be handled by using a Prometheus database and afterwards analyzed with Grafana.
https://prometheus.io

![grafana expample dashboard](/doc/metrics_md_1.png)

## Configuring

Add the following lines inside your prometheus.yml configuration file. Section "scrape_configs:"

```
- job_name: 'vrsreplace'
  scrape_interval: 10s # >= Depending on your meassurement interval
  static_configs:
  - targets: ['<IP of VRS-Replace>']
    metrics_path: /metrics
```