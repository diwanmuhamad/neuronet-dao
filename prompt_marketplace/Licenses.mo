import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
    public type License = Types.License;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Licenses() {
        private var licenses : [License] = [];
        private var nextLicenseId : Nat = 0;

        public func createLicense(
            itemId : Nat,
            buyer : Principal,
            expiration : ?Time.Time
        ) : License {
            let license : License = {
                id = nextLicenseId;
                itemId = itemId;
                buyer = buyer;
                timestamp = Time.now();
                expiration = expiration;
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
    };
};
