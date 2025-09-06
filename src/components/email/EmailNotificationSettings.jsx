import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Container, Row, Col } from 'react-bootstrap';

// Import child components
import NotificationSettings from './NotificationSettings';
import EmailVerification from './EmailVerification';

// --- Constants ---
const policyOptions = [
  { value: 'NEW_TICKET', label: 'Не оповещать о новых заявках' },
  { value: 'NEW_MESSAGE', label: 'Не оповещать о сообщениях' },
  { value: 'NEW_SYSTEM_MESSAGE', label: 'Не оповещать о системных событиях' },
  { value: 'NEW_TICKET_OR_MESSAGE', label: 'Не оповещать о новых заявках и сообщениях' },
  { value: 'CHANGE_TICKET', label: 'Не оповещать об изменениях заявки (статус, приоритет)' },
  { value: 'NONE', label: 'Получать все оповещения' },
];

const policyDescriptions = policyOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {});

/**
 * Main component for managing email notification settings.
 * It holds the state and logic, and delegates rendering to child components.
 */
function EmailNotificationSettings() {
  // --- State Management ---
  const [currentLevel, setCurrentLevel] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [capId, setCapId] = useState('');
  const [capCode, setCapCode] = useState('');

  // Status messages
  const [status, setStatus] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');

  // Loading states
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // Resend code timer logic
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // --- Effects ---
  useEffect(() => {
    const fetchMuteLevel = async () => {
      setLoadingInfo(true);
      try {
        const res = await axiosInstance.get('/api/v1/email/info');
        setCurrentLevel(res.data.muteLevel);
        setSelectedPolicy(res.data.muteLevel);
      } catch (err) {
        console.error('⛔ Ошибка при получении muteLevel:', err);
        setStatus('Ошибка при загрузке текущих настроек.');
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchMuteLevel();
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // --- Handlers ---
  const handleSavePolicy = async (e) => {
    e.preventDefault();
    if (!selectedPolicy) {
      setStatus('⚠️ Выберите уровень перед сохранением');
      return;
    }
    setLoadingSave(true);
    setStatus('');
    try {
      const res = await axiosInstance.post(`/api/v1/email/notify-set?level=${selectedPolicy}`);
      if (res.data === 'Успешно') {
        setStatus('✅ Настройки успешно сохранены!');
        setCurrentLevel(selectedPolicy);
      } else {
        setStatus(`⚠️ Неожиданный ответ от сервера: ${res.data}`);
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      setStatus(
          <>
            ⛔ Ошибка при сохранении настроек. Возможно, ваша сессия устарела, просто <a href="/login">повторите авторизацию</a>.
          </>
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const trimmedCode = verificationCode.trim();
    if (!trimmedCode) {
      setVerifyStatus('⚠️ Введите код из письма');
      return;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedCode)) {
      setVerifyStatus('⚠️ Неверный формат кода. Проверьте код и попробуйте снова.');
      return;
    }
    setLoadingVerify(true);
    setVerifyStatus('');
    try {
      const res = await axiosInstance.get(`/api/v1/email/confirm?token=${trimmedCode}`);
      setVerifyStatus(res.data === 'Успешно' ? '✅ Email успешно подтверждён!' : `Ответ сервера: ${res.data}`);
    } catch (err) {
      console.error('Ошибка при подтверждении email:', err);
      setVerifyStatus('⛔ Не удалось подтвердить email. Код может быть неверным или устаревшим.');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    if (!capId || !capCode.trim()) {
      setVerifyStatus('⚠️ Введите текст с картинки (CAPTCHA), чтобы отправить код.');
      return;
    }
    setCanResend(false);
    setVerifyStatus('Отправляем код...');
    setResendTimer(60);
    try {
      const res = await axiosInstance.get(`/api/v1/email/code?capId=${capId}&capCode=${encodeURIComponent(capCode)}`);
      setVerifyStatus(res.data === 'Успешно' ? '📨 Новый код был отправлен на ваш email.' : `Cтатус: ${res.data}`);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || '⛔ Не удалось повторно отправить код. Попробуйте обновить страницу.';
      setVerifyStatus(errorMsg);
      setCanResend(true);
      setResendTimer(0);
    } finally {
      setCapCode('');
    }
  };

  // --- Render ---
  return (
      <Container className="my-4 my-lg-5">
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <div className="text-center mb-4">
              <h3 className="mb-2">Настройки Email-уведомлений</h3>
            </div>

            <NotificationSettings
                loadingInfo={loadingInfo}
                currentLevel={currentLevel}
                policyDescriptions={policyDescriptions}
                selectedPolicy={selectedPolicy}
                setSelectedPolicy={setSelectedPolicy}
                handleSavePolicy={handleSavePolicy}
                loadingSave={loadingSave}
                policyOptions={policyOptions}
                status={status}
            />

            <EmailVerification
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                handleVerifyEmail={handleVerifyEmail}
                loadingVerify={loadingVerify}
                setCapId={setCapId}
                capCode={capCode}
                setCapCode={setCapCode}
                handleResendCode={handleResendCode}
                canResend={canResend}
                resendTimer={resendTimer}
                verifyStatus={verifyStatus}
            />
          </Col>
        </Row>
      </Container>
  );
}

export default EmailNotificationSettings;
