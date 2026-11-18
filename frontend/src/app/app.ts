import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioApiService } from './portfolio-api.service';
import type { Profile, Project } from './portfolio.models';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'portfolio-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal('');
  protected readonly contactState = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  protected readonly toast = signal<{ kind: 'success' | 'error'; message: string } | null>(null);
  protected readonly biographyParagraphs = computed(() =>
    this.profile()?.biography.split(/\n\s*\n/).filter(Boolean) ?? [],
  );
  protected readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
  });

  ngOnInit(): void {
    this.loadPortfolio();
  }

  protected loadPortfolio(): void {
    this.loading.set(true);
    this.loadError.set('');
    this.api.getPortfolioContent().subscribe({
      next: ({ profile, projects }) => {
        this.profile.set(profile);
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Portfolio content could not be loaded. Check that the backend is running, then try again.');
        this.loading.set(false);
      },
    });
  }

  protected submitContact(): void {
    if (this.contactForm.invalid || this.contactState() === 'sending') {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.dismissToast();
    this.contactState.set('sending');
    this.api.submitContactMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.contactForm.reset();
        this.contactState.set('success');
        this.showToast('success', 'Thanks for reaching out. Your message has been received.');
      },
      error: (error: HttpErrorResponse) => {
        this.contactState.set('error');
        if (error.status === 400) {
          this.showToast('error', 'Please check your details and try again.');
        } else {
          this.showToast('error', 'We couldn’t send your message just now. Please try again in a moment.');
        }
      },
    });
  }

  protected dismissToast(): void {
    window.clearTimeout(this.toastTimer);
    this.toast.set(null);
  }

  private toastTimer = 0;

  private showToast(kind: 'success' | 'error', message: string): void {
    window.clearTimeout(this.toastTimer);
    this.toast.set({ kind, message });
    this.toastTimer = window.setTimeout(() => this.toast.set(null), 7000);
  }
  }
