import { Component, inject, input, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../model/cliente';

@Component({
  selector: 'app-cliente-detalle',
  imports: [RouterLink, DatePipe],
  templateUrl: './cliente-detalle.component.html',
  styleUrl: './cliente-detalle.component.css'
})
export class ClienteDetalleComponent {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  // Se llena solo con el :id de la ruta (withComponentInputBinding)
  id = input.required<string>();

  cliente = signal<Cliente>(new Cliente());

  constructor() {
    // Se ejecuta al crear el componente y cada vez que cambie id()
    effect(() => {
      this.clienteService.getCliente(+this.id()).subscribe(cliente => {
        this.cliente.set(cliente);
      });
    });
  }

  deleteCliente(): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(this.cliente().id!).subscribe(() => {
          this.router.navigate(['/clientes']);
          Swal.fire('Eliminado', 'El cliente fue eliminado.', 'success');
        });
      }
    });
  }
}
