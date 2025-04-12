document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("classificationForm")
  
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault()
  
        const classificationId = document.getElementById("classification_id").value
  
        try {
          const response = await fetch(`/inv/getInventory/${classificationId}`)
  
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
  
          const data = await response.json()
  
          buildInventoryTable(data)
        } catch (error) {
          console.error("Error fetching inventory:", error)
          document.getElementById("inventoryDisplay").innerHTML = "<p>Error loading inventory.</p>"
        }
      })
    }
  
    function buildInventoryTable(data) {
      if (data.length === 0) {
        document.getElementById("inventoryDisplay").innerHTML = "<p>No vehicles found for this classification.</p>"
        return
      }
  
      let table = `<table>
        <thead>
          <tr>
            <th>Vehicle Name</th>
            <th>Year</th>
            <th>Price</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>`
  
      data.forEach(vehicle => {
        table += `<tr>
          <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
          <td>${vehicle.inv_year}</td>
          <td>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</td>
          <td><a href="#">Modify</a></td>
          <td><a href="#">Delete</a></td>
        </tr>`
      })
  
      table += "</tbody></table>"
  
      document.getElementById("inventoryDisplay").innerHTML = table
    }
  })
  