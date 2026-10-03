const BASE_URL = 'http://localhost:5000/api';

export async function fetchOrders() {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error("Backend offline");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function fetchOrderById(id) {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}`);
    if (!res.ok) throw new Error("Backend offline");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function createOrderApi(orderData) {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function updateOrderStatusApi(id, status, comment = '', trackingNumber = '', transactionId = '') {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, comment, trackingNumber, transactionId })
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function confirmReceivingApi(id, receivingData) {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}/receiving`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receivingData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function updateReplacementApi(id, action, comment = '') {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}/replacement`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comment })
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function uploadBillsApi(id, billData) {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData)
    });
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

export async function fetchNotifications() {
  try {
    const res = await fetch(`${BASE_URL}/notifications`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}
