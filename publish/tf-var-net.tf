variable "development_ip_addresses" {
  type = list(string)
  default = [
    "71.191.48.46",   # nic home
    "71.121.252.105", # hammad home
    "142.127.4.130",  # renee trotter  (nic's cousin) - UX
    "14.100.38.23"    # marie-claire delorme (sister) - singapore
  ]
}

variable "create_dns_entry" {
  description = "If set to true, create a DNS A Record in Cloud DNS for the domain specified in 'custom_domain_name'."
  type        = bool
  default     = false
}

variable "dns_record_ttl" {
  description = "The time-to-live for the load balancer A record (seconds)"
  type        = string
  default     = 60
}