import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-action-dialog',
  imports: [ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './confirm-action-dialog.html'
})

export class ConfirmActionDialog implements OnInit {
  submitted = signal(false);

  constructor(
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig
  ) { }

  ngOnInit() {
    const data = this.config.data as {
      confirmation: string;
    } | undefined;

    this.confirmationService.confirm({
      message: data?.confirmation || 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: () => {
        this.submitted.set(true);
        this.ref.close(true);
      },
      reject: () => {
        this.submitted.set(true);
        this.ref.close(false);
      },
    });
  }
}