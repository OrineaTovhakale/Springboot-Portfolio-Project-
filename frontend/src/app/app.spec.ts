import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('renders the portfolio and loads profile and projects', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpTesting.expectOne('/api/profile').flush({
      name: 'Orinea Tovhakale',
      title: 'Software Developer / Data Scientist',
      tagline: 'Building Technology. Understanding Data. Creating Impact.',
      biography: 'First paragraph.\n\nSecond paragraph.',
    });
    httpTesting.expectOne('/api/projects').flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Building with purpose.');
    expect(fixture.nativeElement.textContent).toContain('Orinea Tovhakale');
    expect(fixture.nativeElement.textContent).toContain('Second paragraph.');
  });

  it('submits a valid contact message to the API', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpTesting.expectOne('/api/profile').flush({
      name: 'Orinea Tovhakale',
      title: 'Software Developer / Data Scientist',
      tagline: 'Building Technology. Understanding Data. Creating Impact.',
      biography: 'First paragraph.',
    });
    httpTesting.expectOne('/api/projects').flush([]);

    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('[formControlName="name"]')!;
    const email = element.querySelector<HTMLInputElement>('[formControlName="email"]')!;
    const message = element.querySelector<HTMLTextAreaElement>('[formControlName="message"]')!;
    name.value = 'Alex Example';
    name.dispatchEvent(new Event('input'));
    email.value = 'alex@example.com';
    email.dispatchEvent(new Event('input'));
    message.value = 'I would like to discuss a project.';
    message.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const request = httpTesting.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Alex Example',
      email: 'alex@example.com',
      message: 'I would like to discuss a project.',
    });
    request.flush({ id: 1, receivedAt: '2026-11-17T19:00:00Z' });
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Your message has been received.');
    expect(element.querySelector('.form-footer')?.textContent).not.toContain('Your message has been received.');
  });

  it('shows a dismissible accessible toast when contact submission fails', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpTesting.expectOne('/api/profile').flush({
      name: 'Orinea Tovhakale',
      title: 'Software Developer / Data Scientist',
      tagline: 'Building Technology. Understanding Data. Creating Impact.',
      biography: 'First paragraph.',
    });
    httpTesting.expectOne('/api/projects').flush([]);

    const element = fixture.nativeElement as HTMLElement;
    const name = element.querySelector<HTMLInputElement>('[formControlName="name"]')!;
    const email = element.querySelector<HTMLInputElement>('[formControlName="email"]')!;
    const message = element.querySelector<HTMLTextAreaElement>('[formControlName="message"]')!;
    name.value = 'Alex Example';
    name.dispatchEvent(new Event('input'));
    email.value = 'alex@example.com';
    email.dispatchEvent(new Event('input'));
    message.value = 'I would like to discuss a project.';
    message.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    httpTesting.expectOne('/api/contact').flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();

    const toast = element.querySelector<HTMLElement>('.toast');
    expect(toast?.getAttribute('role')).toBe('alert');
    expect(toast?.textContent).toContain('We couldn’t send your message just now.');
    expect(toast?.textContent).not.toContain('Your message could not be sent.');
    expect(element.querySelector('.form-footer')?.textContent).not.toContain('couldn’t send');
    element.querySelector<HTMLButtonElement>('[aria-label="Dismiss notification"]')!.click();
    fixture.detectChanges();
    expect(element.querySelector('.toast')).toBeNull();
  });
});
