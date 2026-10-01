Here is a complete, developer-ready API reference generated directly from the [SME Plug Postman Documentation](https://documenter.getpostman.com/view/2351511/SzS5umB5?version=latest). It contains full paths, headers, JSON request/response bodies, data types, and webhook payload schema so your local agent can generate code instantly.

---

# SME Plug API Specification (v1)

### Base Configuration

* **Base URL:** `[https://smeplug.ng/api/v1](https://smeplug.ng/api/v1)`
* **Content-Type:** `application/json`
* **Authentication Header:**
```http
Authorization: Bearer {{private_key}}

```



---

## 1. Authentication & Wallet

### GET `/account/balance`

Fetch current wallet balance.

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "balance": 3229.12
}

```



---

## 2. Networks & Data Plans

### GET `/networks`

Retrieve available mobile network providers and their corresponding network IDs.

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "networks": {
    "1": "MTN",
    "2": "Airtel",
    "3": "9Mobile",
    "4": "Glo"
  }
}

```



### GET `/data/plans`

Fetch available data plans grouped by Network ID (`"1"` = MTN, `"2"` = Airtel, `"3"` = 9Mobile, `"4"` = Glo).

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "1": [
      {
        "id": "1",
        "name": "500MB [SME]",
        "price": "220",
        "telco_price": "0"
      },
      {
        "id": "2",
        "name": "1GB [SME]",
        "price": "410",
        "telco_price": "0"
      }
    ],
    "2": [
      {
        "id": "AIR1000",
        "name": "1.5GB ",
        "price": "920",
        "telco_price": "920"
      }
    ],
    "3": [
      {
        "id": "9MOB500",
        "name": "500MB",
        "price": "400",
        "telco_price": "400"
      }
    ],
    "4": [
      {
        "id": "49",
        "name": "N500 1GB",
        "price": "500",
        "telco_price": "500"
      }
    ]
  }
}

```



---

## 3. Data & Airtime Transactions

### POST `/data/purchase`

Purchase a data bundle for a beneficiary number.

* **Headers:**
```http
Authorization: Bearer {{private_key}}
Content-Type: application/json

```


* **Request Body:**
```json
{
  "network_id": "1",
  "plan_id": "1",
  "phone": "09012345678",
  "customer_reference": "ref_unique_12345"
}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "message": "Transaction Successful",
  "data": {
    "reference": "46634e8384c7c68f5baa",
    "customer_reference": "ref_unique_12345",
    "type": "Data purchase",
    "beneficiary": "09012345678",
    "amount": "220",
    "status": "success"
  }
}

```



### POST `/airtime/purchase`

Purchase airtime top-up.

* **Headers:**
```http
Authorization: Bearer {{private_key}}
Content-Type: application/json

```


* **Request Body:**
```json
{
  "network_id": "1",
  "amount": "500",
  "phone": "09012345678",
  "customer_reference": "ref_airtime_987"
}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "message": "Airtime purchase successful",
  "data": {
    "reference": "83748239482934",
    "customer_reference": "ref_airtime_987",
    "status": "success"
  }
}

```



---

## 4. Banking & Transfers

### GET `/banks`

Fetch supported commercial banks and their codes.

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "data": [
    {
      "code": "057",
      "name": "Zenith Bank"
    },
    {
      "code": "011",
      "name": "First Bank of Nigeria"
    }
  ]
}

```



### POST `/bank/resolve`

Verify and resolve account owner name prior to bank transfer.

* **Headers:**
```http
Authorization: Bearer {{private_key}}
Content-Type: application/json

```


* **Request Body:**
```json
{
  "bank_code": "057",
  "account_number": "0123456789"
}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "account_number": "0123456789",
    "account_name": "JOHN DOE"
  }
}

```



### POST `/bank/transfer`

Initiate bank transfer.

* **Headers:**
```http
Authorization: Bearer {{private_key}}
Content-Type: application/json

```


* **Request Body:**
```json
{
  "bank_code": "057",
  "account_number": "0123456789",
  "amount": "5000",
  "narration": "Payment for services",
  "customer_reference": "tx_transfer_001"
}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "message": "Transfer initiated successfully",
  "data": {
    "reference": "trf_99238423",
    "status": "success"
  }
}

```



---

## 5. VTU Topup & Share/Sell

### POST `/vtu/topup`

Perform VTU or Share & Sell transactions.

* **Headers:**
```http
Authorization: Bearer {{private_key}}
Content-Type: application/json

```


* **Request Body:**
```json
{
  "network_id": "1",
  "phone": "09012345678",
  "amount": "1000",
  "type": "vtu",
  "customer_reference": "vtu_ref_101"
}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "message": "VTU topup processed",
  "data": {
    "reference": "vtu_847392",
    "status": "success"
  }
}

```



---

## 6. Logs & Hardware Management

### GET `/transactions`

Retrieve log history of past API transactions.

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "data": [
    {
      "reference": "46634e8384c7c68f5baa",
      "customer_reference": "ref_unique_12345",
      "type": "Data purchase",
      "beneficiary": "09012345678",
      "amount": "220",
      "status": "success",
      "created_at": "2026-10-01 12:00:00"
    }
  ]
}

```



### GET `/devices`

Fetch connected SIM/hardware devices attached to account.

* **Headers:**
```http
Authorization: Bearer {{private_key}}

```


* **Response (200 OK):**
```json
{
  "status": true,
  "devices": []
}

```



---

## 7. Webhook Configuration

Set your webhook callback endpoint in the SMEPlug settings dashboard. Notifications are sent automatically for both successful and failed request updates.

* **Webhook POST Payload Received by Your Server:**
```json
{
  "transaction": {
    "status": "success",
    "reference": "46634e8384c7c68f5baa",
    "customer_reference": "38dhdhdsk",
    "type": "Data purchase",
    "beneficiary": "090XXXXXXXX",
    "memo": "500MB (SME) - Monthly data purchase for 090XXXXXXXX",
    "response": "500MB (SME) - Monthly data purchase for 090XXXXXXXX",
    "price": "200"
  }
}

```