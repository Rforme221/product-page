import { Order } from '../types';

export interface SheetConfig {
  spreadsheetId?: string;
  tabName: string; // 'Sheet1'
  accessToken?: string | null;
}

export const TARGET_SPREADSHEET_ID = '1hq9PX946Lkkm8T5JIlC1K-SlnL0kDj3P9fwzVmxe_PA';
export const TARGET_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1hq9PX946Lkkm8T5JIlC1K-SlnL0kDj3P9fwzVmxe_PA/edit?usp=sharing';

const DEFAULT_SHEET_TAB = 'Sheet1';

export function formatOrderForSheetRow(order: Order): (string | number)[] {
  const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return [
    order.id,
    formattedDate,
    order.customerName,
    order.phoneNumber,
    order.email,
    `${order.location} (${order.deliveryArea})`,
    order.productName,
    order.quantity,
    order.pricePerPiece,
    order.totalPrice,
    order.paymentMethod,
    order.orderStatus,
    order.notes || '',
  ];
}

export const SHEET_HEADERS = [
  'Order ID',
  'Date & Time',
  'Customer Name',
  'Phone Number',
  'Email Address',
  'Exact Location',
  'Product Name',
  'Quantity',
  'Price Per Piece',
  'Total Price',
  'Payment Method',
  'Order Status',
  'Notes',
];

export async function appendOrderToGoogleSheet(
  order: Order,
  spreadsheetId: string,
  accessToken: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const range = `${DEFAULT_SHEET_TAB}!A1:M1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;

    const rowValues = formatOrderForSheetRow(order);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google Sheets API append failed:', errText);
      return { success: false, message: `Sheets API error: ${response.statusText}` };
    }

    const data = await response.json();
    console.log('Successfully logged order to Google Sheet:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to append order to Google Sheet:', error);
    return { success: false, message: error.message || 'Network error' };
  }
}

export async function createSpreadsheetFile(
  accessToken: string,
  orders: Order[] = []
): Promise<{ success: boolean; spreadsheetId?: string; spreadsheetUrl?: string; message?: string }> {
  try {
    // 1. Create spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `PinP Store COD Orders (${new Date().toLocaleDateString('en-US')})`,
        },
        sheets: [
          {
            properties: {
              title: DEFAULT_SHEET_TAB,
            },
          },
        ],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return { success: false, message: `Failed to create sheet: ${err}` };
    }

    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const spreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Populate headers and initial orders
    const rows = [SHEET_HEADERS, ...orders.map(formatOrderForSheetRow)];
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${DEFAULT_SHEET_TAB}!A1:M${rows.length}?valueInputOption=USER_ENTERED`;

    await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    // Save newly created spreadsheet ID in localStorage for automatic updates
    localStorage.setItem('pinp_google_sheet_id', spreadsheetId);

    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
    };
  } catch (error: any) {
    console.error('Failed to create Google Sheet:', error);
    return { success: false, message: error.message || 'Error creating Google Sheet' };
  }
}

export function exportOrdersToCSV(orders: Order[]): string {
  const rows = [SHEET_HEADERS, ...orders.map(formatOrderForSheetRow)];
  return rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function downloadOrdersCSV(orders: Order[]) {
  const csvContent = exportOrdersToCSV(orders);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `pinp_cod_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
