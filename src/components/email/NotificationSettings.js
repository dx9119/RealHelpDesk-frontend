import React from 'react';
import {
    Card,
    Row,
    Col,
    Spinner,
    Form,
    InputGroup,
    Button,
    Alert,
} from 'react-bootstrap';

/**
 * Displays and handles the notification policy settings.
 * @param {object} props - The props object.
 * @param {boolean} props.loadingInfo - Whether the initial info is loading.
 * @param {string} props.currentLevel - The current notification level.
 * @param {object} props.policyDescriptions - A map of policy values to their labels.
 * @param {string} props.selectedPolicy - The currently selected policy in the dropdown.
 * @param {function} props.setSelectedPolicy - Function to update the selected policy.
 * @param {function} props.handleSavePolicy - The form submission handler.
 * @param {boolean} props.loadingSave - Whether the save operation is in progress.
 * @param {Array<object>} props.policyOptions - The list of available policy options.
 * @param {string} props.status - The status message to display.
 */
function NotificationSettings({
                                  loadingInfo,
                                  currentLevel,
                                  policyDescriptions,
                                  selectedPolicy,
                                  setSelectedPolicy,
                                  handleSavePolicy,
                                  loadingSave,
                                  policyOptions,
                                  status,
                              }) {
    return (
        <Card className="shadow mb-4 border-light-subtle">
            <Card.Body className="p-4">
                <Row className="gy-4 align-items-center">
                    <Col lg={5}>
                        <h5 className="mb-2">🛎️ Текущий уровень</h5>
                        {loadingInfo ? (
                            <Spinner animation="border" variant="primary" size="sm" />
                        ) : (
                            <p className="lead text-muted">
                                {policyDescriptions[currentLevel] || `Неизвестный (${currentLevel})`}
                            </p>
                        )}
                    </Col>
                    <Col lg={7}>
                        <h5 className="mb-2">⚙️ Изменить настройки</h5>
                        <Form onSubmit={handleSavePolicy}>
                            <InputGroup>
                                <Form.Select
                                    value={selectedPolicy}
                                    onChange={(e) => setSelectedPolicy(e.target.value)}
                                    disabled={loadingInfo}
                                    aria-label="Выберите уровень уведомлений"
                                >
                                    <option value="" disabled>— Выберите новый уровень —</option>
                                    {policyOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Button variant="primary" type="submit" disabled={loadingSave || loadingInfo}>
                                    {loadingSave ? <Spinner as="span" animation="border" size="sm" /> : '💾 Сохранить'}
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
                {status && <Alert variant="info" className="mt-3 mb-0">{status}</Alert>}
            </Card.Body>
        </Card>
    );
}

export default NotificationSettings;
