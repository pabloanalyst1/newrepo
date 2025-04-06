document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm")
    const passwordInput = document.getElementById("account_password")
  
    if (form) {
      form.addEventListener("submit", function (e) {
        const password = passwordInput.value
        const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{12,}$/
  
        const existingError = document.getElementById("passwordError")
        if (existingError) existingError.remove()
  
        if (!pattern.test(password)) {
          e.preventDefault()
  
          const errorMsg = document.createElement("p")
          errorMsg.id = "passwordError"
          errorMsg.style.color = "red"
          errorMsg.textContent =
            "Password must be at least 12 characters long and include at least 1 number, 1 uppercase letter, and 1 special character."
  
          passwordInput.insertAdjacentElement("afterend", errorMsg)
        }
      })
    }
  })
  