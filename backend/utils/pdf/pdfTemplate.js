import moment from "moment";

function addCurrencyCommas(currency) {
  if (currency || currency === 0) {
    return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return "0";
}

function safeNum(value, decimals = 2) {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(decimals);
}

export default function ({
  profile = {},
  document = {},
  balanceDue = 0,
  status = "Unpaid",
  totalAmountReceived = 0,
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      max-width: 1200px;
      border: 2px solid #eee;
      box-shadow: 0 0 10px rgba(0,0,0,.15);
      margin: auto;
      padding: 20px;
      border-radius: 10px;
    }
    .container { margin: 0 auto; padding-top: 10px; }
    .heading { height: 180px; }
    .left { float: left; }
    .right { float: right; }
    .divider {
      height: 3px;
      background-color: rgb(17,65,141);
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .column { float: left; width: 30%; padding: 7px; }
    .row:after { content: ""; display: table; clear: both; }
    .two-column { float: left; width: 50%; }
    img { width: 150px; height: 150px; }
    .header {
      font-weight: 100;
      text-transform: uppercase;
      color: #555;
      letter-spacing: 2px;
      font-size: 10px;
      line-height: 5px;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      border: 1px solid #ddd;
      font-family: Arial, Helvetica, sans-serif;
    }
    th, td { text-align: left; padding: 16px; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .summary { margin: 20px 0 15px 50%; }
  </style>
  </head>
  <body>
    <div class="container">
      <section class="heading">
        <div class="left">
          ${
            profile?.avatar
              ? `<img src=${profile.avatar} alt="profile image"/>`
              : `<h2>___</h2>`
          }
        </div>
        <div class="right">
          <h2 style="font-size: 38px; font-weight:200;">
            ${Number(balanceDue) <= 0 ? "Receipt" : document?.documentType || "Invoice"}
          </h2>
          <h6 style="font-size: 18px; color:#5a5a5a;">
            <b>No: ${document?.documentNumber || "N/A"}</b>
          </h6>
        </div>
      </section>

      <hr class="divider">

      <section class="row">
        <div class="column">
          <h3 style="font-size: 14px;"> <strong>From:</strong></h3>
          <p style="font-size: 12px">${profile?.businessName || ""}</p>
          <p style="font-size: 12px">${profile?.email || ""}</p>
          <p style="font-size: 12px">${profile?.phoneNumber || ""}</p>
          <p style="font-size: 12px">${profile?.address || ""}</p>
          <p style="font-size: 12px">${profile?.city || ""}</p>
          <p style="font-size: 12px">${profile?.country || ""}</p>
        </div>

        <div class="column">
          <h3 style="font-size: 14px;"> <strong>Bill To:</strong></h3>
          <p style="font-size: 12px">${document?.customer?.name || ""}</p>
          <p style="font-size: 12px">VAT/TIN No: ${document?.customer?.vatTinNo || ""}</p>
          <p style="font-size: 12px">${document?.customer?.email || ""}</p>
          <p style="font-size: 12px">${document?.customer?.phoneNumber || ""}</p>
          <p style="font-size: 12px">${document?.customer?.address || ""}</p>
          <p style="font-size: 12px">${document?.customer?.city || ""}</p>
          <p style="font-size: 12px">${document?.customer?.country || ""}</p>
        </div>

        <div class="column">
          <h3 style="font-size: 14px;"> <strong>Payment Status:</strong></h3>
          <h4 style="font-size: 12px">
            ${Number(totalAmountReceived) >= Number(document?.total || 0) ? "Paid" : status}
          </h4>
          <p class="header">Issued on:</p>
          <p style="font-size: 12px">${moment(document?.createdAt).format("DD-MM-YYYY")}</p>
          <p class="header">Due on:</p>
          <p style="font-size: 12px">${moment(document?.dueDate).format("DD-MM-YYYY")}</p>
          <p class="header">Total Amount:</p>
          <p>
            <b><span style="font-size: 16px">${document?.currency || "₹"}</span></b>
            <b><span style="font-size: 16px">${addCurrencyCommas(safeNum(document?.total))}</span></b>
          </p>
        </div>
      </section>

      <hr class="divider">

      <table>
        <tr style="background-color: black; color:white">
          <th>#</th>
          <th>Product/Service</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Discount (%)</th>
          <th>Line Total</th>
        </tr>
        ${
          (document?.billingItems || [])
            .map(
              (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item?.itemName || ""}</td>
                  <td>${safeNum(item?.quantity, 0)}</td>
                  <td>${safeNum(item?.unitPrice)}</td>
                  <td>${safeNum(item?.discount, 0)}</td>
                  <td>${safeNum(
                    item?.quantity * item?.unitPrice -
                      (item?.quantity * item?.unitPrice * (item?.discount || 0)) / 100
                  )}</td>
                </tr>`
            )
            .join("")
        }
      </table>

      <section class="summary">
        <table>
          <tr style="background-color: black; color:white">
            <th style="text-align:center">Cost Summary</th>
            <th></th>
          </tr>
          <tr>
            <td>Sub Total:</td>
            <td style="text-align: right;">
              ${document?.currency || "₹"} ${addCurrencyCommas(safeNum(document?.subTotal))}
            </td>
          </tr>
          <tr>
            <td>VAT/Sales Tax (${safeNum(document?.rates, 0)}%):</td>
            <td style="text-align: right;">
              ${document?.currency || "₹"} ${addCurrencyCommas(safeNum(document?.salesTax))}
            </td>
          </tr>
          <tr>
            <td>Cumulative Total:</td>
            <td style="text-align: right;">
              ${document?.currency || "₹"} ${addCurrencyCommas(safeNum(document?.total))}
            </td>
          </tr>
          <tr>
            <td>Amount Paid:</td>
            <td style="text-align: right;">
              ${document?.currency || "₹"} ${addCurrencyCommas(safeNum(totalAmountReceived))}
            </td>
          </tr>
          <tr>
            <td>Balance:</td>
            <td style="text-align: right;">
              ${document?.currency || "₹"} ${addCurrencyCommas(
                safeNum((document?.total || 0) - (totalAmountReceived || 0))
              )}
            </td>
          </tr>
        </table>
      </section>

      <hr class="divider">

      <section class="row">
        <div class="two-column">
          <h4>Additional Info</h4>
          <p>${document?.additionalInfo || "N/A"}</p>
        </div>
        <div class="two-column">
          <h4>Terms & Conditions</h4>
          <p>${document?.termsConditions || "N/A"}</p>
        </div>
      </section>
    </div>
  </body>
  </html>
  `;
}
