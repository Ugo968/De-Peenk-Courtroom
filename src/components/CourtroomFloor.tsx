import { useState } from 'react';
import { motion } from 'framer-motion';

interface CourtroomFloorProps {
  onSeatSelected: (seatId: number) => void;
}

interface Seat {
  id: number;
  row: number;
  position: number;
  isOccupied: boolean;
  occupant?: string;
}

export function CourtroomFloor({ onSeatSelected }: CourtroomFloorProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Generate courtroom seats (5 rows, 8 seats per row)
  const seats: Seat[] = [];
  for (let row = 1; row <= 5; row++) {
    for (let position = 1; position <= 8; position++) {
      // Simulate some occupied seats
      const isOccupied = Math.random() > 0.7;
      seats.push({
        id: (row - 1) * 8 + position,
        row,
        position,
        isOccupied,
        occupant: isOccupied ? `FL-${Math.random().toString(36).substring(7).toUpperCase()}` : undefined,
      });
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;
    
    setSelectedSeat(seat.id);
  };

  const handleConfirmSeat = () => {
    if (selectedSeat === null) return;
    
    setIsConfirming(true);
    
    // Simulate seat selection animation
    setTimeout(() => {
      onSeatSelected(selectedSeat);
    }, 1500);
  };

  const selectedSeatData = seats.find(s => s.id === selectedSeat);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-4xl font-bold text-gradient-pink mb-2">
          The Courtroom Floor
        </h1>
        <p className="text-pink-600/70 text-lg">
          Choose your seat and take your place among the listeners
        </p>
      </motion.div>

      {/* Courtroom Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-full max-w-4xl"
      >
        {/* Judge's Bench (top) */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 rounded-t-3xl px-12 py-6 border-2 border-gold-400 shadow-gold">
              <div className="text-4xl mb-2">👑</div>
              <h3 className="font-heading text-xl font-bold text-gold-700">
                Chief Judge's Bench
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Lawyer's Table */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-sky-200 via-sky-300 to-sky-200 rounded-2xl px-8 py-4 border-2 border-sky-400 shadow-lg">
              <div className="text-3xl mb-1">⚖️</div>
              <h3 className="font-heading text-lg font-bold text-sky-700">
                Lawyers' Table
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Audience Seats */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <motion.div
              key={row}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + row * 0.1 }}
              className="flex justify-center gap-3"
            >
              {seats
                .filter(seat => seat.row === row)
                .map((seat) => {
                  const isSelected = selectedSeat === seat.id;
                  const isOccupied = seat.isOccupied;

                  return (
                    <motion.button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isOccupied}
                      className={`relative w-16 h-16 rounded-2xl transition-all ${
                        isOccupied
                          ? 'bg-gray-200 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-pink scale-110'
                          : 'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 hover:scale-105'
                      }`}
                      whileHover={!isOccupied ? { y: -5 } : {}}
                      whileTap={!isOccupied ? { scale: 0.95 } : {}}
                    >
                      {/* Seat cushion */}
                      <div className={`absolute inset-2 rounded-xl ${
                        isOccupied
                          ? 'bg-gray-300'
                          : isSelected
                          ? 'bg-white/30'
                          : 'bg-pink-300/50'
                      }`} />

                      {/* Seat number */}
                      <div className={`relative z-10 text-xs font-bold ${
                        isOccupied
                          ? 'text-gray-500'
                          : isSelected
                          ? 'text-white'
                          : 'text-pink-600'
                      }`}>
                        {seat.id}
                      </div>

                      {/* Occupied indicator */}
                      {isOccupied && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✕</span>
                        </div>
                      )}

                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}

                      {/* Occupant handle (tooltip) */}
                      {isOccupied && seat.occupant && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {seat.occupant}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-100 to-pink-200" />
            <span className="text-pink-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-400 to-pink-600" />
            <span className="text-pink-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <span className="text-pink-600">Occupied</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation Panel */}
      {selectedSeat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-200 shadow-pink">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💺</div>
              <h3 className="font-heading text-xl font-bold text-pink-700">
                Seat #{selectedSeat}
              </h3>
              <p className="text-sm text-pink-600">
                Row {selectedSeatData?.row}, Position {selectedSeatData?.position}
              </p>
            </div>

            <motion.button
              onClick={handleConfirmSeat}
              disabled={isConfirming}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold shadow-pink hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!isConfirming ? { scale: 1.02 } : {}}
              whileTap={!isConfirming ? { scale: 0.98 } : {}}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Taking Your Seat...
                </span>
              ) : (
                '✨ Confirm Seat'
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-pink-500 italic">
          Click on an available seat to select it, then confirm to enter the courtroom
        </p>
      </motion.div>
    </div>
  );
}
