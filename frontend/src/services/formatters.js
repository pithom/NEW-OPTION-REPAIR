export const STATUS_OPTIONS = ['Pending', 'Diagnosed', 'In Progress', 'Completed', 'Delivered'];
export const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'Partial', 'Paid'];

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium'
  }).format(new Date(value));
};

export const toInputDate = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const statusTone = (status) => {
  const tones = {
    Pending: 'pending',
    Diagnosed: 'diagnosed',
    'In Progress': 'progress',
    Completed: 'completed',
    Delivered: 'delivered',
    Unpaid: 'unpaid',
    Partial: 'partial',
    Paid: 'paid'
  };

  return tones[status] || 'pending';
};
