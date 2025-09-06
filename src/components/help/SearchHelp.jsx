import React, { useState } from 'react';
import { Button, Collapse, Card } from 'react-bootstrap';

const SearchHelp = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="my-3">
            <Button
                variant="outline-secondary"
                onClick={() => setOpen(!open)}
                aria-controls="search-help-text"
                aria-expanded={open}
            >
                {open ? 'Скрыть справку 🔽' : 'Как работает поиск по заявкам? 🔍'}
            </Button>

            <Collapse in={open}>
                <div id="search-help-text" className="mt-3">
                    <Card className="border-secondary">
                        <Card.Body className="text-start small">
                            <h6 className="mb-3">🔍 Как работает поиск заявок</h6>
                            <ul className="ps-3 mb-0">
                                <li className="mb-2">
                                    Поиск охватывает все порталы, к которым у вас есть доступ, включая те, где вы добавлены как внешний пользователь.
                                </li>
                                <li className="mb-2">
                                    Пользователи портала могут ограничить доступ к заявкам, изменив статус доступа к порталу.
                                </li>
                                <li className="mb-2">
                                    В результатах будут отображаться заявки из <strong>публичных порталов</strong>, если вы ранее создавали заявки в них.
                                </li>
                                <li className="mb-0">
                                    <em>Важно:</em> Если заявка была создана в публичном портале с настройкой доступа «Только мне и пользователям портала», она появится в поиске, но открыть её вы не сможете.
                                </li>
                            </ul>
                        </Card.Body>

                    </Card>
                </div>
            </Collapse>
        </div>
    );
};

export default SearchHelp;
