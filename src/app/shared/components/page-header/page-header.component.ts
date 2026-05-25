import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() backPath?: string;

  private readonly router = inject(Router);

  navigateBack(): void {
    if (this.backPath) this.router.navigate([this.backPath]);
  }
}
