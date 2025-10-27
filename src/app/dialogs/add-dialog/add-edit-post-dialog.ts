import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User } from '@/Models/user.model';
import { post } from '@/Models/post.model';
import { CommonModule,  } from '@angular/common';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-add-edit-post-dialog',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    TextareaModule,
    RadioButtonModule,
    SelectModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './add-edit-post-dialog.html',
  styleUrls: ['./add-edit-post-dialog.scss']
})
export class AddEditPostDialog implements OnInit {
  private _mode = signal<Mode>('create');
  mode = computed(() => this._mode());

  private _post = signal<post>({
    id: 0,
    title: '',
    description: '',
    category: '',
    CreatedBy: { id: 0, userName: '', email: '', password: '' },
    comments: []
  });
  post = computed(() => this._post());

  submitted = signal(false);

  categories = ['Accessories', 'Clothing', 'Electronics', 'Fitness'];
  userOptions: User[] = [];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    const data = this.config.data as {
      mode?: Mode;
      post?: post | null;
      users?: User[] | null;
    } | undefined;

    if (data?.mode) this._mode.set(data.mode);
    if (Array.isArray(data?.users)) this.userOptions = data!.users!;

    if (data?.post) {
      const clone: post = JSON.parse(JSON.stringify(data.post));
      this._post.set(clone);
    }
  }

  onCancel() {
    this.ref.close();
  }

  onSave() {
    this.submitted.set(true);

    const p = this.post();
    if (!p.title || !p.description || !p.category || !p.CreatedBy?.userName) return;

    if (!Array.isArray(p.comments)) p.comments = [];
    this.ref.close(p);
  }

  trackByCat = (_: number, val: string) => val;
}
