// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;



contract WarrantyRegistry {

    struct Warranty {
        string productId;
        address owner;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }
    mapping(string => Warranty) private warranties;

    event WarrantyCreated(
        string productId,
        address owner,
        uint256 startDate,
        uint256 endDate
    );

    event WarrantyTransferred(
        string productId,
        address oldOwner,
        address newOwner
    );

    function createWarranty(
        string memory _productId,
        address _owner,
        uint256 _durationDays
    ) public {
        require(!warranties[_productId].isActive, "Warranty already exists");
        uint256 start = block.timestamp;
        uint256 end = start + (_durationDays * 1 days);

        warranties[_productId] = Warranty({
            productId: _productId,
            owner: _owner,
            startDate: start,
            endDate: end,
            isActive: true
        });
        emit WarrantyCreated(_productId, _owner, start, end);

    }

    function getWarranty(string memory _productId)
        public
        view
        returns (
            address owner,
            uint256 startDate,
            uint256 endDate,
            bool isActive
        )

    {
        Warranty memory w = warranties[_productId];
        return (w.owner, w.startDate, w.endDate, w.isActive);
    }

    function transferWarranty(
        string memory _productId,
        address _newOwner
    ) public {
        Warranty storage w = warranties[_productId];
        require(w.isActive, "Warranty not active");
        require(msg.sender == w.owner, "Not warranty owner");

        address oldOwner = w.owner;
        w.owner = _newOwner;

        emit WarrantyTransferred(_productId, oldOwner, _newOwner);
    }
}