"use client";
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Zap, Shield } from 'lucide-react';
import Logo from './Logo';
import './DrawerWidget.css';

interface FormData {
  // NAW (Naam, Adres, Woonplaats)
  voornaam: string;
  achternaam: string;
  adres: string;
  postcode: string;
  woonplaats: string;
  
  // Bedrijfsgegevens
  bedrijfsnaam: string;
  kvkNummer: string;
  bedrijfsactiviteiten: string;
  
  // Financiering
  gewenstBedrag: string;
  bestedingsdoel: string;
  
  // Contact
  email: string;
  telefoonnummer: string;
}

const initialFormData: FormData = {
  voornaam: '',
  achternaam: '',
  adres: '',
  postcode: '',
  woonplaats: '',
  bedrijfsnaam: '',
  kvkNummer: '',
  bedrijfsactiviteiten: '',
  gewenstBedrag: '',
  bestedingsdoel: '',
  email: '',
  telefoonnummer: ''
};

interface DrawerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const COOKIE_NAME = 'lijfrente_form_progress';
const COOKIE_EXPIRY_DAYS = 7;

export default function DrawerWidget({ isOpen, onClose }: DrawerWidgetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load saved progress from cookie on mount
  useEffect(() => {
    if (isOpen) {
      const savedData = getCookie(COOKIE_NAME);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed.formData || initialFormData);
          setCurrentStep(parsed.currentStep || 1);
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
  }, [isOpen]);

  // Auto-save to cookie on form data change
  useEffect(() => {
    if (isOpen) {
      const saveData = {
        formData,
        currentStep,
        savedAt: new Date().toISOString()
      };
      setCookie(COOKIE_NAME, JSON.stringify(saveData), COOKIE_EXPIRY_DAYS);
    }
  }, [formData, currentStep, isOpen]);

  // Cookie helpers
  function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (step) {
      case 1: // Bedrijfsgegevens
        if (!formData.bedrijfsnaam.trim()) newErrors.bedrijfsnaam = 'Bedrijfsnaam is verplicht';
        if (!formData.kvkNummer.trim()) newErrors.kvkNummer = 'KvK nummer is verplicht';
        if (!formData.bedrijfsactiviteiten.trim()) newErrors.bedrijfsactiviteiten = 'Bedrijfsactiviteiten zijn verplicht';
        break;
      
      case 2: // Financiering
        if (!formData.gewenstBedrag.trim()) newErrors.gewenstBedrag = 'Gewenst bedrag is verplicht';
        if (!formData.bestedingsdoel.trim()) newErrors.bestedingsdoel = 'Bestedingsdoel is verplicht';
        break;
      
      case 3: // NAW + Contact
        if (!formData.voornaam.trim()) newErrors.voornaam = 'Voornaam is verplicht';
        if (!formData.achternaam.trim()) newErrors.achternaam = 'Achternaam is verplicht';
        if (!formData.adres.trim()) newErrors.adres = 'Adres is verplicht';
        if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is verplicht';
        if (!formData.woonplaats.trim()) newErrors.woonplaats = 'Woonplaats is verplicht';
        if (!formData.email.trim()) newErrors.email = 'E-mailadres is verplicht';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Ongeldig e-mailadres';
        }
        if (!formData.telefoonnummer.trim()) newErrors.telefoonnummer = 'Telefoonnummer is verplicht';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      
      // Track step completion
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ 
          event: 'drawer_step_complete',
          step: currentStep
        });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Track form submission
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ 
          event: 'form_submit',
          form_type: 'drawer_widget'
        });
      }
      
      // Submit to your backend
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Clear saved progress
        deleteCookie(COOKIE_NAME);
        
        // Redirect to thank you page
        window.location.href = '/bedankt';
      } else {
        alert('Er is een fout opgetreden. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    
    // Track drawer close
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 
        event: 'drawer_close',
        step: currentStep
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="drawer-step">
            <h2>Bedrijfsgegevens</h2>
            <p className="step-description">Vertel ons over uw bedrijf</p>
            
            <div className="form-fields">
              <div className="field-group">
                <label htmlFor="bedrijfsnaam">Bedrijfsnaam *</label>
                <input
                  id="bedrijfsnaam"
                  type="text"
                  placeholder="Bijvoorbeeld: Bakkerij Jansen"
                  value={formData.bedrijfsnaam}
                  onChange={(e) => updateFormData('bedrijfsnaam', e.target.value)}
                  className={errors.bedrijfsnaam ? 'error' : ''}
                  autoFocus
                />
                {errors.bedrijfsnaam && <span className="field-error">{errors.bedrijfsnaam}</span>}
              </div>
              
              <div className="field-group">
                <label htmlFor="kvkNummer">KvK nummer *</label>
                <input
                  id="kvkNummer"
                  type="text"
                  placeholder="12345678"
                  value={formData.kvkNummer}
                  onChange={(e) => updateFormData('kvkNummer', e.target.value)}
                  className={errors.kvkNummer ? 'error' : ''}
                  maxLength={8}
                />
                {errors.kvkNummer && <span className="field-error">{errors.kvkNummer}</span>}
              </div>
              
              <div className="field-group">
                <label htmlFor="bedrijfsactiviteiten">Bedrijfsactiviteiten *</label>
                <textarea
                  id="bedrijfsactiviteiten"
                  placeholder="Beschrijf kort wat uw bedrijf doet..."
                  value={formData.bedrijfsactiviteiten}
                  onChange={(e) => updateFormData('bedrijfsactiviteiten', e.target.value)}
                  className={errors.bedrijfsactiviteiten ? 'error' : ''}
                  rows={3}
                />
                {errors.bedrijfsactiviteiten && <span className="field-error">{errors.bedrijfsactiviteiten}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="drawer-step">
            <h2>Financiering</h2>
            <p className="step-description">Wat heeft u nodig?</p>
            
            <div className="form-fields">
              <div className="field-group">
                <label htmlFor="gewenstBedrag">Gewenst bedrag *</label>
                <input
                  id="gewenstBedrag"
                  type="text"
                  placeholder="€ 50.000"
                  value={formData.gewenstBedrag}
                  onChange={(e) => updateFormData('gewenstBedrag', e.target.value)}
                  className={errors.gewenstBedrag ? 'error' : ''}
                  autoFocus
                />
                {errors.gewenstBedrag && <span className="field-error">{errors.gewenstBedrag}</span>}
              </div>
              
              <div className="field-group">
                <label htmlFor="bestedingsdoel">Bestedingsdoel *</label>
                <textarea
                  id="bestedingsdoel"
                  placeholder="Waarvoor wilt u de financiering gebruiken?"
                  value={formData.bestedingsdoel}
                  onChange={(e) => updateFormData('bestedingsdoel', e.target.value)}
                  className={errors.bestedingsdoel ? 'error' : ''}
                  rows={4}
                />
                {errors.bestedingsdoel && <span className="field-error">{errors.bestedingsdoel}</span>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="drawer-step">
            <h2>Contactgegevens</h2>
            <p className="step-description">Hoe kunnen we u bereiken?</p>
            
            <div className="form-fields">
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="voornaam">Voornaam *</label>
                  <input
                    id="voornaam"
                    type="text"
                    placeholder="Jan"
                    value={formData.voornaam}
                    onChange={(e) => updateFormData('voornaam', e.target.value)}
                    className={errors.voornaam ? 'error' : ''}
                    autoFocus
                  />
                  {errors.voornaam && <span className="field-error">{errors.voornaam}</span>}
                </div>
                
                <div className="field-group">
                  <label htmlFor="achternaam">Achternaam *</label>
                  <input
                    id="achternaam"
                    type="text"
                    placeholder="Jansen"
                    value={formData.achternaam}
                    onChange={(e) => updateFormData('achternaam', e.target.value)}
                    className={errors.achternaam ? 'error' : ''}
                  />
                  {errors.achternaam && <span className="field-error">{errors.achternaam}</span>}
                </div>
              </div>
              
              <div className="field-group">
                <label htmlFor="adres">Adres *</label>
                <input
                  id="adres"
                  type="text"
                  placeholder="Hoofdstraat 123"
                  value={formData.adres}
                  onChange={(e) => updateFormData('adres', e.target.value)}
                  className={errors.adres ? 'error' : ''}
                />
                {errors.adres && <span className="field-error">{errors.adres}</span>}
              </div>
              
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="postcode">Postcode *</label>
                  <input
                    id="postcode"
                    type="text"
                    placeholder="1234 AB"
                    value={formData.postcode}
                    onChange={(e) => updateFormData('postcode', e.target.value)}
                    className={errors.postcode ? 'error' : ''}
                  />
                  {errors.postcode && <span className="field-error">{errors.postcode}</span>}
                </div>
                
                <div className="field-group">
                  <label htmlFor="woonplaats">Woonplaats *</label>
                  <input
                    id="woonplaats"
                    type="text"
                    placeholder="Amsterdam"
                    value={formData.woonplaats}
                    onChange={(e) => updateFormData('woonplaats', e.target.value)}
                    className={errors.woonplaats ? 'error' : ''}
                  />
                  {errors.woonplaats && <span className="field-error">{errors.woonplaats}</span>}
                </div>
              </div>
              
              <div className="field-group">
                <label htmlFor="email">E-mailadres *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jan@voorbeeld.nl"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              
              <div className="field-group">
                <label htmlFor="telefoonnummer">Telefoonnummer *</label>
                <input
                  id="telefoonnummer"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.telefoonnummer}
                  onChange={(e) => updateFormData('telefoonnummer', e.target.value)}
                  className={errors.telefoonnummer ? 'error' : ''}
                />
                {errors.telefoonnummer && <span className="field-error">{errors.telefoonnummer}</span>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={handleClose} />
      <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Logo size={32} showText={true} />
            <div className="step-indicator">
              Stap {currentStep} van 3
            </div>
          </div>
          <button className="drawer-close" onClick={handleClose} aria-label="Sluiten">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
          <div className="progress-dots">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`progress-dot ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="drawer-body">
          {renderStep()}
        </div>

        <div className="drawer-footer">
          <div className="drawer-nav">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                <ChevronLeft size={20} />
                Vorige
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Volgende
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verzenden...' : 'Aanvraag versturen'}
                <Check size={20} />
              </button>
            )}
          </div>
          
          <div className="drawer-trust">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} /> Veilig en vertrouwd
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} /> Binnen 24 uur reactie
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

