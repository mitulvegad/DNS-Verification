import pytest
from app.services.domain_service import normalize_domain, validate_domain

def test_normalize_domain():
    assert normalize_domain("https://www.example.com/") == "example.com"
    assert normalize_domain("HTTP://EXAMPLE.COM") == "example.com"
    assert normalize_domain("example.com") == "example.com"
    assert normalize_domain("Example.COM.") == "example.com"
    assert normalize_domain("https://shop.example.com/products") == "example.com"

def test_validate_domain():
    assert validate_domain("example.com") == True
    assert validate_domain("localhost") == False
    assert validate_domain("127.0.0.1") == False
    assert validate_domain("https://") == False
    assert validate_domain("not a domain") == False
