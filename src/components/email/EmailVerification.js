import React from 'react';
import {
    Card,
    Row,
    Col,
    Spinner,
    Alert,
    Button,
    Form,
    InputGroup,
} from 'react-bootstrap';
import CaptchaViewer from '../captcha/CaptchaViewer';

/**
 * Displays and handles the email verification process.
 * @param {object} props - The props object.
 * @param {string} props.verificationCode - The verification code input value.
 * @param {function} props.setVerificationCode - Function to update the verification code.
 * @param {function} props.handleVerifyEmail - The form submission handler for verification.
 * @param {boolean} props.loadingVerify - Whether the verification is in progress.
 * @param {function} props.setCapId - Function to set the CAPTCHA ID.
 * @param {string} props.capCode - The CAPTCHA code input value.
 * @param {function} props.setCapCode - Function to update the CAPTCHA code.
 * @param {function} props.handleResendCode - Handler to request a new code.
 * @param {boolean} props.canResend - Whether the resend button is enabled.
 * @param {number} props.resendTimer - The countdown timer for resending.
 * @param {string} props.verifyStatus - The status message for the verification process.
 */
function EmailVerification({
                               verificationCode,
                               setVerificationCode,
                               handleVerifyEmail,
                               loadingVerify,
                               setCapId,
                               capCode,
                               setCapCode,
                               handleResendCode,
                               canResend,
                               resendTimer,
                               verifyStatus,
                           }) {
    return (
        <Card className="shadow border-light-subtle">
            <Card.Header className="bg-light py-3">
                <h5 className="mb-0">✅ Подтверждение Email</h5>
            </Card.Header>

            <Card.Body className="p-4">
                {/* Форма подтверждения кода из письма */}
                <Form onSubmit={handleVerifyEmail} className="mb-4">
                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                placeholder="Введите код из письма"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                disabled={loadingVerify}
                            />
                            <Button variant="success" type="submit" disabled={loadingVerify}>
                                {loadingVerify ? <Spinner as="span" animation="border" size="sm" /> : 'Подтвердить'}
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Form>

                <hr className="my-4" />

                {/* Инструкция */}
                <h6 className="mb-3">Не пришел код подтверждения регистрации?</h6>
                <p className="text-muted small">Введите текст с капчи ниже и запросите код еще раз.</p>

                {/* CAPTCHA */}
                <Form>
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <CaptchaViewer onCaptchaIdChange={setCapId} />
                        </div>
                        <Form.Control
                            placeholder="Введите текст с картинки (капчи)"
                            value={capCode}
                            onChange={(e) => setCapCode(e.target.value)}
                        />
                    </Form.Group>
                </Form>

                {/* Кнопка повторной отправки */}
                <div className="d-grid d-md-block mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={handleResendCode}
                        disabled={!canResend}
                    >
                        {canResend ? '📨 Отправить код ещё раз' : `⏳ Повтор через ${resendTimer} сек.`}
                    </Button>
                </div>

                {/* Статус */}
                {verifyStatus && (
                    <Alert variant="info" className="mt-3 mb-0">
                        {verifyStatus}
                    </Alert>
                )}
            </Card.Body>
        </Card>

    );
}

export default EmailVerification;
