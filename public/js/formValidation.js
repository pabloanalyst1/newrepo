document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm")
  const firstName = document.getElementById("account_firstname")
  const lastName = document.getElementById("account_lastname")
  const email = document.getElementById("account_email")
  const password = document.getElementById("account_password")

  if (form) {
    form.addEventListener("submit", function (e) {
      let valid = true
      clearErrors()

      if (!firstName.value.trim()) {
        showError(firstName, "First name is required.")
        valid = false
      }

      if (!lastName.value.trim()) {
        showError(lastName, "Last name is required.")
        valid = false
      }

      if (!email.value.trim()) {
        showError(email, "Email is required.")
        valid = false
      } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        showError(email, "Invalid email format.")
        valid = false
      }

      const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{12,}$/
      if (!pattern.test(password.value)) {
        showError(password, "Password must be at least 12 characters long, include 1 number, 1 uppercase letter, and 1 special character.")
        valid = false
      }

      if (!valid) {
        e.preventDefault()
      }
    })
  }

  function showError(input, message) {
    const error = document.createElement("p")
    error.className = "client-error"
    error.style.color = "red"
    error.textContent = message
    input.insertAdjacentElement("afterend", error)
  }

  function clearErrors() {
    document.querySelectorAll(".client-error").forEach(el => el.remove())
  }
})
