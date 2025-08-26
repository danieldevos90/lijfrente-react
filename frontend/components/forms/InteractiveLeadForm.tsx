"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Building, Euro, Target, User, Phone, Mail, MapPin } from 'lucide-react';

interface FormData {
  // Step 1: Financing Amount
  amount: string;
  amountRange: string;
  
  // Step 2: Business Type
  businessType: string;
  businessSize: string;
  
  // Step 3: Purpose
  purpose: string;
  urgency: string;
  
  // Step 4: Business Details
  companyName: string;
  kvkNumber: string;
  revenue: string;
  
  // Step 5: Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Step 6: Additional Info
  existingFinancing: string;
  additionalInfo: string;
}

const initialFormData: FormData = {
  amount: '',
  amountRange: '',
  businessType: '',
  businessSize: '',
  purpose: '',
  urgency: '',
  companyName: '',
  kvkNumber: '',
  revenue: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  existingFinancing: '',
  additionalInfo: ''
};

const steps = [
  { id: 1, title: 'Financieringsbedrag', icon: Euro, description: 'Hoeveel heeft u nodig?' },
  { id: 2, title: 'Bedrijfstype', icon: Building, description: 'Vertel over uw bedrijf' },
  { id: 3, title: 'Doel', icon: Target, description: 'Waarvoor gebruikt u het?' },
  { id: 4, title: 'Bedrijfsgegevens', icon: Building, description: 'Uw bedrijfsinformatie' },
  { id: 5, title: 'Contactgegevens', icon: User, description: 'Hoe kunnen we u bereiken?' },
  { id: 6, title: 'Afronding', icon: Check, description: 'Laatste details' }
];

interface InteractiveLeadFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export default function InteractiveLeadForm({ onSuccess, isModal = false }: InteractiveLeadFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (step) {
      case 1:
        if (!formData.amount && !formData.amountRange) {
          newErrors.amount = 'Selecteer een bedrag';
        }
        break;
      case 2:
        if (!formData.businessType) newErrors.businessType = 'Selecteer uw bedrijfstype';
        if (!formData.businessSize) newErrors.businessSize = 'Selecteer bedrijfsgrootte';
        break;
      case 3:
        if (!formData.purpose) newErrors.purpose = 'Selecteer het doel';
        if (!formData.urgency) newErrors.urgency = 'Selecteer urgentie';
        break;
      case 4:
        if (!formData.companyName) newErrors.companyName = 'Bedrijfsnaam is verplicht';
        if (!formData.kvkNumber) newErrors.kvkNumber = 'KvK nummer is verplicht';
        break;
      case 5:
        if (!formData.firstName) newErrors.firstName = 'Voornaam is verplicht';
        if (!formData.lastName) newErrors.lastName = 'Achternaam is verplicht';
        if (!formData.email) newErrors.email = 'E-mail is verplicht';
        if (!formData.phone) newErrors.phone = 'Telefoonnummer is verplicht';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
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
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'Lead Generation',
          event_label: 'Interactive Form Complete'
        });
      }
      
      // Submit to your backend/CRM
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        if (isModal && onSuccess) {
          // Call success callback for modal
          onSuccess();
        } else {
          // Redirect to thank you page
          window.location.href = '/bedankt';
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Hoeveel financiering heeft u nodig?</h2>
            <p className="step-description">Selecteer het bedrag dat het beste bij uw situatie past</p>
            
            <div className="amount-grid">
              {[
                { value: '25000', label: '€ 25.000', popular: false },
                { value: '50000', label: '€ 50.000', popular: true },
                { value: '100000', label: '€ 100.000', popular: false },
                { value: '250000', label: '€ 250.000', popular: false },
                { value: '500000', label: '€ 500.000', popular: false },
                { value: 'custom', label: 'Ander bedrag', popular: false }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`amount-option ${formData.amount === option.value ? 'selected' : ''} ${option.popular ? 'popular' : ''}`}
                  onClick={() => updateFormData('amount', option.value)}
                >
                  {option.popular && <span className="popular-badge">Populair</span>}
                  <span className="amount-label">{option.label}</span>
                </button>
              ))}
            </div>
            
            {formData.amount === 'custom' && (
              <div className="custom-amount">
                <label>Gewenst bedrag</label>
                <input
                  type="number"
                  placeholder="Voer bedrag in"
                  value={formData.amountRange}
                  onChange={(e) => updateFormData('amountRange', e.target.value)}
                />
              </div>
            )}
            
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Wat voor type bedrijf heeft u?</h2>
            <p className="step-description">Dit helpt ons de beste financieringsoptie voor u te vinden</p>
            
            <div className="business-type-grid">
              {[
                { value: 'eenmanszaak', label: 'Eenmanszaak', icon: User },
                { value: 'bv', label: 'BV / NV', icon: Building },
                { value: 'vof', label: 'VOF / Maatschap', icon: User },
                { value: 'stichting', label: 'Stichting / Vereniging', icon: Building }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`business-option ${formData.businessType === option.value ? 'selected' : ''}`}
                    onClick={() => updateFormData('businessType', option.value)}
                  >
                    <IconComponent size={32} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="business-size">
              <h3>Bedrijfsgrootte</h3>
              <div className="size-options">
                {[
                  { value: 'starter', label: 'Starter (0-2 jaar)' },
                  { value: 'klein', label: 'Klein bedrijf (2-10 werknemers)' },
                  { value: 'middel', label: 'Middelbedrijf (10-50 werknemers)' },
                  { value: 'groot', label: 'Groot bedrijf (50+ werknemers)' }
                ].map((option) => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="businessSize"
                      value={option.value}
                      checked={formData.businessSize === option.value}
                      onChange={(e) => updateFormData('businessSize', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {errors.businessType && <div className="error-message">{errors.businessType}</div>}
            {errors.businessSize && <div className="error-message">{errors.businessSize}</div>}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Waarvoor gaat u de financiering gebruiken?</h2>
            <p className="step-description">Selecteer het hoofddoel van uw financiering</p>
            
            <div className="purpose-grid">
              {[
                { value: 'werkkapitaal', label: 'Werkkapitaal', desc: 'Voor dagelijkse bedrijfsvoering' },
                { value: 'uitbreiding', label: 'Uitbreiding', desc: 'Groei en nieuwe investeringen' },
                { value: 'inventaris', label: 'Inventaris', desc: 'Machines en apparatuur' },
                { value: 'vastgoed', label: 'Vastgoed', desc: 'Pand aankoop of verbouwing' },
                { value: 'voorraad', label: 'Voorraad', desc: 'Inkoop van goederen' },
                { value: 'overbrugging', label: 'Overbrugging', desc: 'Tijdelijke cashflow' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`purpose-option ${formData.purpose === option.value ? 'selected' : ''}`}
                  onClick={() => updateFormData('purpose', option.value)}
                >
                  <div className="purpose-label">{option.label}</div>
                  <div className="purpose-desc">{option.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="urgency-section">
              <h3>Wanneer heeft u het geld nodig?</h3>
              <div className="urgency-options">
                {[
                  { value: 'direct', label: 'Direct (binnen 1 week)' },
                  { value: 'kort', label: 'Binnenkort (1-4 weken)' },
                  { value: 'maand', label: 'Binnen een maand' },
                  { value: 'kwartaal', label: 'Dit kwartaal' }
                ].map((option) => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={(e) => updateFormData('urgency', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {errors.purpose && <div className="error-message">{errors.purpose}</div>}
            {errors.urgency && <div className="error-message">{errors.urgency}</div>}
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Vertel ons over uw bedrijf</h2>
            <p className="step-description">Deze gegevens helpen ons uw aanvraag sneller te verwerken</p>
            
            <div className="form-fields">
              <div className="field-group">
                <label>Bedrijfsnaam *</label>
                <input
                  type="text"
                  placeholder="Uw bedrijfsnaam"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="field-error">{errors.companyName}</span>}
              </div>
              
              <div className="field-group">
                <label>KvK nummer *</label>
                <input
                  type="text"
                  placeholder="12345678"
                  value={formData.kvkNumber}
                  onChange={(e) => updateFormData('kvkNumber', e.target.value)}
                  className={errors.kvkNumber ? 'error' : ''}
                />
                {errors.kvkNumber && <span className="field-error">{errors.kvkNumber}</span>}
              </div>
              
              <div className="field-group">
                <label>Jaaromzet (ongeveer)</label>
                <select
                  value={formData.revenue}
                  onChange={(e) => updateFormData('revenue', e.target.value)}
                >
                  <option value="">Selecteer omzet</option>
                  <option value="0-50k">€ 0 - € 50.000</option>
                  <option value="50k-100k">€ 50.000 - € 100.000</option>
                  <option value="100k-250k">€ 100.000 - € 250.000</option>
                  <option value="250k-500k">€ 250.000 - € 500.000</option>
                  <option value="500k-1m">€ 500.000 - € 1.000.000</option>
                  <option value="1m+">€ 1.000.000+</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>Hoe kunnen we u bereiken?</h2>
            <p className="step-description">We nemen binnen 24 uur contact met u op</p>
            
            <div className="form-fields">
              <div className="field-row">
                <div className="field-group">
                  <label>Voornaam *</label>
                  <input
                    type="text"
                    placeholder="Uw voornaam"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                
                <div className="field-group">
                  <label>Achternaam *</label>
                  <input
                    type="text"
                    placeholder="Uw achternaam"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="field-group">
                <label>E-mailadres *</label>
                <input
                  type="email"
                  placeholder="uw@email.nl"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              
              <div className="field-group">
                <label>Telefoonnummer *</label>
                <input
                  type="tel"
                  placeholder="06 - 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h2>Laatste vragen</h2>
            <p className="step-description">Deze informatie helpt ons u nog beter te adviseren</p>
            
            <div className="form-fields">
              <div className="field-group">
                <label>Heeft u al bestaande financieringen?</label>
                <div className="radio-group">
                  {[
                    { value: 'nee', label: 'Nee, geen bestaande financieringen' },
                    { value: 'ja-weinig', label: 'Ja, maar beperkt' },
                    { value: 'ja-veel', label: 'Ja, meerdere financieringen' }
                  ].map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name="existingFinancing"
                        value={option.value}
                        checked={formData.existingFinancing === option.value}
                        onChange={(e) => updateFormData('existingFinancing', e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="field-group">
                <label>Aanvullende informatie (optioneel)</label>
                <textarea
                  placeholder="Vertel ons meer over uw situatie..."
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="summary-section">
              <h3>Samenvatting van uw aanvraag</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Bedrag:</strong> €{formData.amount === 'custom' ? formData.amountRange : formData.amount}
                </div>
                <div className="summary-item">
                  <strong>Bedrijf:</strong> {formData.companyName}
                </div>
                <div className="summary-item">
                  <strong>Doel:</strong> {formData.purpose}
                </div>
                <div className="summary-item">
                  <strong>Urgentie:</strong> {formData.urgency}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="interactive-lead-form">
      {/* Progress Header */}
      <div className="form-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-indicator">
          <span className="step-current">Stap {currentStep}</span>
          <span className="step-total">van {steps.length}</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="form-body">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="form-footer">
        <div className="nav-buttons">
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
          
          {currentStep < steps.length ? (
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
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verzenden...' : 'Aanvraag versturen'}
              <Check size={20} />
            </button>
          )}
        </div>
        
        <div className="form-trust">
          <div className="trust-items">
            <span>🔒 100% veilig</span>
            <span>⚡ Binnen 24 uur reactie</span>
            <span>📞 Gratis adviesgesprek</span>
          </div>
        </div>
      </div>
    </div>
  );
}
