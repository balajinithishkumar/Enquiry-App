import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PickupBooking from './PickupBooking';
import RateCardForm from './RateCard';
import VendorRateCard from './VendorRateCard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PickupBooking />} />
          <Route path="/sale-rates" element={<RateCardForm />} />
          <Route path="/Vendor-rates" element={<VendorRateCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;