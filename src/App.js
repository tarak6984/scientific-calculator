import React, { useState, useEffect, useCallback } from 'react';

// Since we can't import Material-UI, I'll create a complete calculator using only React
const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [input, setInput] = useState('');
  const [ans, setAns] = useState(0);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePanel, setActivePanel] = useState(0);
  const [angleMode, setAngleMode] = useState('deg');
  const [shiftActive, setShiftActive] = useState(false);
  const [alphaActive, setAlphaActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Styles
  const styles = {
    container: {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a0033 25%, #003366 50%, #1a0033 75%, #0a0a0a 100%)'
        : 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #fecfef 75%, #ff9a9e 100%)',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    calculatorWrapper: {
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(30, 30, 60, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      marginBottom: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    title: {
      fontSize: '1rem',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #667eea, #764ba2, #ff6b6b)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      animation: 'float 3s ease-in-out infinite',
    },
    displayCard: {
      background: isDarkMode 
        ? 'rgba(15, 15, 35, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '2px solid transparent',
      borderRadius: '20px',
      marginBottom: '16px',
      padding: '24px',
      position: 'relative',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #4400ff, #ff00ff)',
      backgroundSize: '200% 200%',
      animation: 'rgbAnimation 3s ease infinite',
    },
    display: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'right',
      color: isDarkMode ? '#ffffff' : '#2d3748',
      marginBottom: '8px',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      wordBreak: 'break-all',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    },
    input: {
      fontSize: '1.2rem',
      textAlign: 'right',
      color: isDarkMode ? '#a0aec0' : '#718096',
      minHeight: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    statusBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: isDarkMode ? '#a0aec0' : '#718096',
      marginTop: '8px',
    },
    chip: (isActive) => ({
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.8rem',
      background: isActive 
        ? 'linear-gradient(45deg, #667eea, #764ba2)'
        : 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
    tabContainer: {
      display: 'flex',
      marginBottom: '16px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    tab: (isActive) => ({
      flex: 1,
      padding: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      background: isActive 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'transparent',
      color: '#ffffff',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: 'none',
    }),
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '16px',
    },
    button: (variant) => {
      const getButtonStyles = () => {
        switch (variant) {
          case 'number':
            return {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
              color: isDarkMode ? '#ffffff' : '#2d3748',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            };
          case 'operator':
            return {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            };
          case 'function':
            return {
              background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            };
          case 'equals':
            return {
              background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            };
          case 'special':
            return {
              background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            };
          default:
            return {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
                : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
              color: isDarkMode ? '#ffffff' : '#2d3748',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            };
        }
      };

      return {
        ...getButtonStyles(),
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: '600',
        minHeight: '55px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    },
    historyModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    historyContent: {
      background: isDarkMode ? '#1a1a2e' : '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '500px',
      maxHeight: '70vh',
      overflow: 'auto',
      color: isDarkMode ? '#ffffff' : '#2d3748',
    },
    historyItem: {
      padding: '12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
    },
    themeToggle: {
      background: 'linear-gradient(45deg, #ffd700, #87ceeb)',
      border: 'none',
      borderRadius: '20px',
      width: '60px',
      height: '30px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s ease',
    },
    toggleThumb: {
      position: 'absolute',
      top: '2px',
      left: isDarkMode ? '32px' : '2px',
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      background: '#ffffff',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
    }
  };

  // Mathematical operations
  const calculate = useCallback((expression) => {
    try {
      let expr = expression
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/Ans/g, ans)
        .replace(/sin\(/g, angleMode === 'deg' ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
        .replace(/cos\(/g, angleMode === 'deg' ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
        .replace(/tan\(/g, angleMode === 'deg' ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/∛\(/g, 'Math.cbrt(')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/x²/g, '**2')
        .replace(/x³/g, '**3')
        .replace(/x⁻¹/g, '**(-1)')
        .replace(/eˣ/g, 'Math.exp')
        .replace(/10ˣ/g, 'Math.pow(10,')
        .replace(/\|([^|]+)\|/g, 'Math.abs($1)');

      const result = Function(`"use strict"; return (${expr})`)();
      return isFinite(result) ? result : 'Error';
    } catch (error) {
      return 'Error';
    }
  }, [ans, angleMode]);

  // Button press handler
  const handleButtonPress = useCallback((value) => {
    if (value === '=') {
      const result = calculate(input || display);
      if (result !== 'Error') {
        setAns(result);
        setHistory(prev => [...prev, { expression: input || display, result }]);
        setDisplay(result.toString());
        setInput('');
      } else {
        setDisplay('Error');
      }
    } else if (value === 'AC') {
      setDisplay('0');
      setInput('');
    } else if (value === 'CE') {
      setInput(input.slice(0, -1) || '0');
      setDisplay(input.slice(0, -1) || '0');
    } else if (value === 'SHIFT') {
      setShiftActive(!shiftActive);
    } else if (value === 'ALPHA') {
      setAlphaActive(!alphaActive);
    } else if (value === 'Ans') {
      setInput(prev => prev + ans);
      setDisplay(ans.toString());
    } else if (value === 'MODE') {
      const modes = ['deg', 'rad', 'grad'];
      const currentIndex = modes.indexOf(angleMode);
      setAngleMode(modes[(currentIndex + 1) % modes.length]);
    } else {
      const newInput = input === '0' ? value : input + value;
      setInput(newInput);
      setDisplay(newInput);
    }
  }, [input, display, calculate, shiftActive, ans, angleMode]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (key >= '0' && key <= '9' || key === '.') {
        handleButtonPress(key);
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleButtonPress(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'Enter' || key === '=') {
        handleButtonPress('=');
      } else if (key === 'Escape') {
        handleButtonPress('AC');
      } else if (key === 'Backspace') {
        handleButtonPress('CE');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleButtonPress]);

  // Button panels
  const basicButtons = [
    ['SHIFT', 'ALPHA', 'AC', 'CE'],
    ['sin', 'cos', 'tan', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'Ans', '=']
  ];

  const advancedPanels = [
    // Algebra
    [
      ['x²', 'x³', 'xⁿ', '√('],
      ['∛(', 'ⁿ√(', '|x|', 'x⁻¹'],
      ['ln(', 'log(', 'eˣ', '10ˣ'],
      ['π', 'e', '(', ')']
    ],
    // Trigonometry
    [
      ['sin(', 'cos(', 'tan(', 'sin⁻¹('],
      ['cos⁻¹(', 'tan⁻¹(', 'sinh(', 'cosh('],
      ['tanh(', 'sinh⁻¹(', 'cosh⁻¹(', 'tanh⁻¹('],
      ['MODE', 'π/180', '180/π', 'DMS']
    ],
    // Statistics
    [
      ['Σx', 'Σx²', 'n', 'x̄'],
      ['σn', 'σn-1', 'nPr', 'nCr'],
      ['n!', 'Ran#', 'RanInt', 'Med'],
      ['Q1', 'Q3', 'Mod', 'Dat']
    ]
  ];

  const getButtonVariant = (btn) => {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(btn)) return 'number';
    if (['+', '-', '×', '÷'].includes(btn)) return 'operator';
    if (['sin(', 'cos(', 'tan(', 'ln(', 'log(', 'sin', 'cos', 'tan', 'ln', 'log'].includes(btn)) return 'function';
    if (btn === '=') return 'equals';
    if (['AC', 'CE'].includes(btn)) return 'special';
    return 'default';
  };

  // CSS animations
  const cssAnimations = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes rgbAnimation {
      0% { border-color: rgba(255, 0, 0, 0.8); }
      16.66% { border-color: rgba(255, 165, 0, 0.8); }
      33.33% { border-color: rgba(255, 255, 0, 0.8); }
      50% { border-color: rgba(0, 255, 0, 0.8); }
      66.66% { border-color: rgba(0, 0, 255, 0.8); }
      83.33% { border-color: rgba(75, 0, 130, 0.8); }
      100% { border-color: rgba(238, 130, 238, 0.8); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        <div style={styles.calculatorWrapper}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>🧮</span>
              <h1 style={styles.title}>Scientific Calculator – Made with ❤️<br /> by Tarak MD Shabbir </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setShowHistory(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isDarkMode ? '#ffffff' : '#2d3748',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  position: 'relative',
                }}
              >
                📜 {history.length > 0 && <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ff6b6b',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{history.length}</span>}
              </button>
              <div style={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
                <div style={styles.toggleThumb}>
                  {isDarkMode ? '🌙' : '☀️'}
                </div>
              </div>
            </div>
          </div>

          {/* Display */}
          <div style={styles.displayCard}>
            <div style={styles.display}>{display}</div>
            <div style={styles.input}>{input}</div>
            <div style={styles.statusBar}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={styles.chip(shiftActive)}>SHIFT</span>
                <span style={styles.chip(alphaActive)}>ALPHA</span>
                <span style={styles.chip(true)}>{angleMode.toUpperCase()}</span>
              </div>
              <div>ANS: {ans}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button 
              style={styles.tab(activePanel === 0)}
              onClick={() => setActivePanel(0)}
            >
              Basic
            </button>
            <button 
              style={styles.tab(activePanel === 1)}
              onClick={() => setActivePanel(1)}
            >
              Algebra
            </button>
            <button 
              style={styles.tab(activePanel === 2)}
              onClick={() => setActivePanel(2)}
            >
              Trig
            </button>
            <button 
              style={styles.tab(activePanel === 3)}
              onClick={() => setActivePanel(3)}
            >
              Stats
            </button>
          </div>

          {/* Button Grid */}
          <div style={styles.buttonGrid}>
            {activePanel === 0 && basicButtons.flat().map((btn, index) => (
              <button
                key={index}
                style={styles.button(getButtonVariant(btn))}
                onClick={() => handleButtonPress(btn)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
              >
                {btn}
              </button>
            ))}
            {activePanel > 0 && advancedPanels[activePanel - 1].flat().map((btn, index) => (
              <button
                key={index}
                style={styles.button(getButtonVariant(btn))}
                onClick={() => handleButtonPress(btn)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* History Modal */}
          {showHistory && (
            <div style={styles.historyModal} onClick={() => setShowHistory(false)}>
              <div style={styles.historyContent} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3>Calculation History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: isDarkMode ? '#ffffff' : '#2d3748',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                  {history.length === 0 ? (
                    <p>No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((item, index) => (
                      <div
                        key={index}
                        style={styles.historyItem}
                        onClick={() => {
                          setDisplay(item.result.toString());
                          setInput(item.result.toString());
                          setShowHistory(false);
                        }}
                      >
                        <div>{item.expression}</div>
                        <div style={{ fontWeight: 'bold', color: '#00b894' }}>= {item.result}</div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setHistory([]);
                    setShowHistory(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '16px',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Clear History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScientificCalculator;