document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-validacion");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Validando...",
      text: "Por favor, espera mientras validamos la operación...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const numeroTarjeta = document.getElementById("tarjeta").value.trim();
    const clave = document.getElementById("pass").value.trim();
    const saldo = Number(document.getElementById("monto").value.trim());

    try {
      const response = await fetch("./datos.json");
      const datos = await response.json();

      // Buscar la tarjeta correspondiente
      const tarjetaValida = datos.find(
        (dato) => dato.tarjeta === numeroTarjeta
      );

      if (!tarjetaValida) {
        setTimeout(() => {
          Swal.close();
          Swal.fire("Error", "Número de tarjeta incorrecto", "error");
        }, 1000);
        return;
      }

      if (tarjetaValida.clave !== clave) {
        setTimeout(() => {
          Swal.close();
          Swal.fire("Error", "Clave incorrecta", "error");
        }, 1000);
        return;
      }

      if (tarjetaValida.saldoDisponible < saldo) {
        setTimeout(() => {
          Swal.close();
          Swal.fire("Error", "Saldo insuficiente", "error");
        }, 1000);
        return;
      }

      setTimeout(() => {
        Swal.close();
        Swal.fire("¡Éxito!", "¡Pago realizado correctamente!", "success").then(
          () => {
            formulario.reset();
          }
        );
      }, 2000);
    } catch (error) {
      Swal.close();
      console.error("Error al procesar los datos:", error);
      Swal.fire(
        "Error",
        "Hubo un problema con la operación. Inténtalo nuevamente.",
        "error"
      );
    }
  });
});
