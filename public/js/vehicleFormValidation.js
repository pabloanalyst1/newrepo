document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form[action='/inv/add-inventory']")
    if (!form) return
  
    form.addEventListener("submit", function (e) {
      const errors = []
      
      const make = document.getElementById("inv_make").value.trim()
      const model = document.getElementById("inv_model").value.trim()
      const year = parseInt(document.getElementById("inv_year").value)
      const description = document.getElementById("inv_description").value.trim()
      const image = document.getElementById("inv_image").value.trim()
      const thumbnail = document.getElementById("inv_thumbnail").value.trim()
      const price = parseFloat(document.getElementById("inv_price").value)
      const miles = parseInt(document.getElementById("inv_miles").value)
      const color = document.getElementById("inv_color").value.trim()
      const classification = parseInt(document.getElementById("classification_id").value)
  
      if (!make) errors.push("Make is required.")
      if (!model) errors.push("Model is required.")
      if (!year || year < 1900 || year > new Date().getFullYear() + 1) errors.push("Please enter a valid year.")
      if (!description) errors.push("Description is required.")
      if (!image) errors.push("Image path is required.")
      if (!thumbnail) errors.push("Thumbnail path is required.")
      if (isNaN(price) || price < 0) errors.push("Valid price is required.")
      if (isNaN(miles) || miles < 0) errors.push("Valid mileage is required.")
      if (!color) errors.push("Color is required.")
      if (isNaN(classification)) errors.push("Please select a classification.")
  
      if (errors.length > 0) {
        e.preventDefault()
  
        // Elimina errores anteriores
        const existingErrorList = document.getElementById("client-errors")
        if (existingErrorList) existingErrorList.remove()
  
        const ul = document.createElement("ul")
        ul.id = "client-errors"
        ul.classList.add("error-list")
        errors.forEach(msg => {
          const li = document.createElement("li")
          li.textContent = msg
          ul.appendChild(li)
        })
  
        form.prepend(ul)
      }
    })
  })
  