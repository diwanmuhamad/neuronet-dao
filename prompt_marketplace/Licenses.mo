import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
    public type License = Types.License;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;
    public type PlatformConfig = Types.PlatformConfig;

    public class Licenses() {
        private var licenses : [License] = [];
        private var nextLicenseId : Nat = 0;
        private let platformConfig : PlatformConfig = { platformFeePercent = 5 };

        public func createLicense(
            itemId : Nat,
            buyer : Principal,
            expiration : ?Time.Time,
            licenseTerms : Text
        ) : License {
            let now = Time.now();
            let license : License = {
                id = nextLicenseId;
                itemId = itemId;
                buyer = buyer;
                createdAt = now;
                updatedAt = now;
                expiration = expiration;
                licenseTerms = licenseTerms;
                isActive = true;
            };
            licenses := Array.append(licenses, [license]);
            nextLicenseId += 1;
            license;
        };

        public func getLicense(id : Nat) : ?License {
            Array.find<License>(licenses, func(l : License) : Bool { l.id == id });
        };

        public func getLicensesByBuyer(buyer : Principal) : [License] {
            Array.filter<License>(licenses, func(l : License) : Bool { l.buyer == buyer });
        };

        public func getLicensesByItem(itemId : Nat) : [License] {
            Array.filter<License>(licenses, func(l : License) : Bool { l.itemId == itemId });
        };

        public func hasLicense(buyer : Principal, itemId : Nat) : Bool {
            let userLicenses = Array.filter<License>(licenses, func(l : License) : Bool {
                l.buyer == buyer and l.itemId == itemId
            });
            Array.size(userLicenses) > 0;
        };

        public func isLicenseValid(licenseId : Nat) : Bool {
            switch (getLicense(licenseId)) {
                case null { false };
                case (?license) {
                    switch (license.expiration) {
                        case null { true }; // No expiration
                        case (?expiration) { Time.now() < expiration };
                    };
                };
            };
        };

        public func getAllLicenses() : [License] {
            licenses;
        };

        public func getLicenseCount() : Nat {
            Array.size(licenses);
        };

        public func revokeLicense(licenseId : Nat) : Result<Bool, Error> {
            let licenseOpt = getLicense(licenseId);
            switch (licenseOpt) {
                case null { #err(#NotFound) };
                case (?_license) {
                    licenses := Array.filter<License>(licenses, func(l : License) : Bool { l.id != licenseId });
                    #ok(true);
                };
            };
        };

        // Calculate platform fee
        public func calculatePlatformFee(price : Nat) : Nat {
            price * platformConfig.platformFeePercent / 100;
        };

        // Calculate creator payment after platform fee
        public func calculateCreatorPayment(price : Nat) : Nat {
            let platformFee = calculatePlatformFee(price);
            price - platformFee;
        };

        // Process license purchase with platform fee
        public func processLicensePurchase(
            itemId : Nat,
            buyer : Principal,
            itemPrice : Nat,
            licenseTerms : Text,
            expiration : ?Time.Time
        ) : { license : License; platformFee : Nat; creatorPayment : Nat } {
            let platformFee = calculatePlatformFee(itemPrice);
            let creatorPayment = calculateCreatorPayment(itemPrice);

            let license = createLicense(itemId, buyer, expiration, licenseTerms);

            {
                license = license;
                platformFee = platformFee;
                creatorPayment = creatorPayment;
            };
        };

        // Deactivate license
        public func deactivateLicense(licenseId : Nat) : Result<Bool, Error> {
            let now = Time.now();
            let updatedLicenses = Array.map<License, License>(
                licenses,
                func(license : License) : License {
                    if (license.id == licenseId) {
                        {
                            id = license.id;
                            itemId = license.itemId;
                            buyer = license.buyer;
                            createdAt = license.createdAt;
                            updatedAt = now;
                            expiration = license.expiration;
                            licenseTerms = license.licenseTerms;
                            isActive = false;
                        }
                    } else {
                        license
                    }
                }
            );
            licenses := updatedLicenses;
            #ok(true);
        };

        // Get active licenses only
        public func getActiveLicenses() : [License] {
            Array.filter<License>(licenses, func(license : License) : Bool {
                license.isActive
            });
        };

        // Get active licenses by buyer
        public func getActiveLicensesByBuyer(buyer : Principal) : [License] {
            Array.filter<License>(licenses, func(license : License) : Bool {
                license.buyer == buyer and license.isActive
            });
        };

        // Check if buyer has active license for item
        public func hasActiveLicense(buyer : Principal, itemId : Nat) : Bool {
            let activeLicenses = Array.filter<License>(licenses, func(license : License) : Bool {
                license.buyer == buyer and license.itemId == itemId and license.isActive
            });
            Array.size(activeLicenses) > 0;
        };

        // Get platform configuration
        public func getPlatformConfig() : PlatformConfig {
            platformConfig;
        };
    };
};
