import {beforeEach} from "mocha";
import {restore, SinonStub, stub} from "sinon";
import {configurationRepository} from "../../../src/repositories/configuration.repository";
import {ELogLevel} from "../../../src/log/log-level.enum";
import {log} from "../../../src/log/log.service";
import {expect} from "chai";

describe("Test si en fonction de la configuration, le log s'éffectue correctement ou non", () => {

	let getLogLevelStub: SinonStub;
	let consoleLogStub: SinonStub;

	beforeEach(() => {
		getLogLevelStub = stub(configurationRepository, 'getLogLevel');
		consoleLogStub = stub(console, 'log');
	});

	afterEach(() => {
		getLogLevelStub.restore();
		consoleLogStub.restore();
		restore();
	});

	describe(`Dans le cas ${ELogLevel.SILENT}, aucun log ne doit apparaître`, () => {
		beforeEach(() => {
			getLogLevelStub.returns(ELogLevel.SILENT);
		});

		it("Les erreurs ne doivent pas apparaître", () => {
			log.error(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les warn ne doivent pas apparaître", () => {
			log.warn(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les info ne doivent pas apparaître", () => {
			log.info(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les debug ne doivent pas apparaître", () => {
			log.debug(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});


	});

	describe(`Dans le cas ${ELogLevel.ERROR}, seules les erreurs doivent apparaître`, () => {
		beforeEach(() => {
			getLogLevelStub.returns(ELogLevel.ERROR);
		});

		it("Les erreurs doivent apparaître", () => {
			log.error(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn ne doivent pas apparaître", () => {
			log.warn(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les info ne doivent pas apparaître", () => {
			log.info(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les debug ne doivent pas apparaître", () => {
			log.debug(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

	});

	describe(`Dans le cas ${ELogLevel.WARN}, seules les erreurs et les warn doivent apparaître`, () => {
		beforeEach(() => {
			getLogLevelStub.returns(ELogLevel.WARN);
		});

		it("Les erreurs doivent apparaître", () => {
			log.error(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn doivent apparaître", () => {
			log.warn(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les info ne doivent pas apparaître", () => {
			log.info(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

		it("Les debug ne doivent pas apparaître", () => {
			log.debug(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

	});

	describe(`Dans le cas ${ELogLevel.INFO}, seuls les debug ne doivent pas apparaître`, () => {
		beforeEach(() => {
			getLogLevelStub.returns(ELogLevel.INFO);
		});

		it("Les erreurs doivent apparaître", () => {
			log.error(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn doivent apparaître", () => {
			log.warn(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn doivent apparaître", () => {
			log.warn(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les debug ne doivent pas apparaître", () => {
			log.debug(undefined, "Ne dois pas apparaître");
			expect(consoleLogStub.called).to.be.false;
		});

	});

	describe(`Dans le cas ${ELogLevel.DEBUG}, tous les logs doivent apparaître`, () => {
		beforeEach(() => {
			getLogLevelStub.returns(ELogLevel.DEBUG);
		});

		it("Les erreurs doivent apparaître", () => {
			log.error(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn doivent apparaître", () => {
			log.warn(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les warn doivent apparaître", () => {
			log.warn(undefined, "Dois apparaître");
			expect(consoleLogStub.called).to.be.true;
		});

		it("Les debug doivent apparaître", () => {
			log.debug(undefined, "Dois appraître");
			expect(consoleLogStub.called).to.be.true;
		});

	});


});