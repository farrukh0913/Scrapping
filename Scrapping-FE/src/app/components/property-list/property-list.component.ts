import { Component } from '@angular/core';
import { ZameenService } from '../../services/zameen.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss',
})
export class PropertyListComponent {
  citySlug = 'Multan-15-1';
  properties: any[] = [];
  loading = false;
  error = '';

  constructor(private zameenService: ZameenService) {
    this.fetchProperties()
  }

  fetchProperties() {
    this.loading = true;
    this.error = '';
    this.properties = [];

    this.zameenService.getProperties(this.citySlug).subscribe({
      next: (data: any) => {
        this.properties = data.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch data';
        this.loading = false;
      },
    });
  }
}
