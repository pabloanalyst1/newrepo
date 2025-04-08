const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    if (data && data.rows) {
      data.rows.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
        list += "</li>"
      })
    } else {
      console.error("❗ Error: No classification data returned.")
    }

    list += "</ul>"
    return list
  } catch (err) {
    console.error("❗ getNav failed:", err)
    return "<ul><li><a href='/'>Home</a></li></ul>" // fallback nav
  }
}


/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `
        <li class="vehicle-card">
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="/images/vehicles/${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" loading="lazy">
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>`
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function (vehicle) {
  let detail = `
    <section class="vehicle-detail">
      <img src="/images/vehicles/${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy">
      <div class="vehicle-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>
        <ul>
          <li><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</li>
          <li><strong>Description:</strong> ${vehicle.inv_description}</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</li>
        </ul>
      </div>
    </section>
  `
  return detail
}

module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildVehicleDetail: Util.buildVehicleDetail,
}
