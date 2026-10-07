import { useState } from 'react'
import { User, Calendar, Mail, Phone, UserCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function Profile() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('lifeline_profile')
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      height: '',
      weight: '',
      bio: '',
    }
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem('lifeline_profile', JSON.stringify(formData))
      setIsSaving(false)
      setIsSaved(true)
      
      setTimeout(() => setIsSaved(false), 3000)
    }, 600)
  }

  let targetProtein = 0
  let targetCalories = 0
  
  if (formData.weight) {
    const w = parseFloat(formData.weight)
    if (!isNaN(w)) targetProtein = Math.round(w * 1.6)
  }
  if (formData.weight && formData.height) {
    const w = parseFloat(formData.weight)
    const h = parseFloat(formData.height)
    if (!isNaN(w) && !isNaN(h)) {
      const bmr = (10 * w) + (6.25 * h) - (5 * 25) + 5
      targetCalories = Math.round(bmr * 1.2)
    }
  }

  return (
    <div className="mx-auto max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 pl-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Your Profile</h1>
        <p className="mt-2 text-muted">Manage your personal information and preferences.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-line">
            <div className="relative h-24 w-24 rounded-full bg-surface-2 flex items-center justify-center border border-line overflow-hidden group">
              <UserCircle className="h-12 w-12 text-muted group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <span className="text-xs font-bold text-white tracking-wider uppercase">Upload</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">Profile Picture</h2>
              <p className="text-sm text-muted mt-1">PNG, JPG up to 5MB.</p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="text-xs font-semibold px-4 py-2 rounded-lg bg-surface-2 border border-line hover:border-lime hover:text-lime transition-colors">
                  Change
                </button>
                <button type="button" className="text-xs font-semibold px-4 py-2 rounded-lg text-muted hover:text-workout transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-3">
              <label htmlFor="name" className="label flex items-center gap-2"><User className="h-3.5 w-3.5" /> Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="label flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="phone" className="label flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="dob" className="label flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none [color-scheme:dark]"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="gender" className="label flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Gender</label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none appearance-none"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="height" className="label flex items-center gap-2">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                value={formData.height || ''}
                onChange={handleChange}
                placeholder="175"
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="weight" className="label flex items-center gap-2">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight || ''}
                onChange={handleChange}
                placeholder="70"
                className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none"
              />
            </div>
          </div>

          {(targetProtein > 0 || targetCalories > 0) && (
            <div className="bg-lime/10 border border-lime/20 rounded-2xl p-5 mt-4 flex items-start gap-4">
              <div className="mt-1 bg-lime/20 p-2 rounded-full">
                <svg className="w-5 h-5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lime">Your Daily Targets</h3>
                <p className="text-sm text-white/80 mt-1 leading-relaxed">
                  Based on your measurements, we recommend a daily goal of <strong className="text-white">{targetProtein}g of protein</strong> and a maintenance target of <strong className="text-white">{targetCalories.toLocaleString()} calories</strong>.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label htmlFor="bio" className="label">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us a little about yourself..."
              className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-white placeholder-muted/50 focus:border-lime focus:ring-1 focus:ring-lime transition-all outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-line mt-8 gap-4">
            <button
              type="button"
              className="px-6 py-3 rounded-xl font-semibold text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                "px-8 py-3 rounded-xl font-semibold transition-all relative flex items-center justify-center min-w-[160px]",
                isSaved 
                  ? "bg-steps text-white" 
                  : "bg-lime text-black hover:bg-[#d4ff4d] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(198,244,50,0.15)] hover:shadow-[0_0_25px_rgba(198,244,50,0.3)]",
                isSaving && "opacity-80 cursor-not-allowed scale-100"
              )}
            >
              {isSaving ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : isSaved ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Saved!
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
